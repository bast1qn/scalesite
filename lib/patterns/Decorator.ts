// ============================================
// DECORATOR PATTERN
// Cross-cutting concerns (logging, caching, metrics)
// ============================================

// ============================================
// INTERFACES
// ============================================

/**
 * Base service interface that all services must implement
 */
export interface IService {
    readonly name: string;
    initialize(): Promise<void>;
    destroy(): Promise<void>;
}

/**
 * Decorator base class
 * Implements the same interface as the service being decorated
 */
export abstract class ServiceDecorator<T extends IService> implements IService {
    constructor(protected readonly service: T) {}

    get name(): string {
        return this.service.name;
    }

    async initialize(): Promise<void> {
        return this.service.initialize();
    }

    async destroy(): Promise<void> {
        return this.service.destroy();
    }
}

// ============================================
// LOGGING DECORATOR
// ============================================

export interface LogEntry {
    timestamp: Date;
    serviceName: string;
    method: string;
    duration?: number;
    success: boolean;
    error?: Error;
    metadata?: Record<string, unknown>;
}

export interface ILogger {
    log(entry: LogEntry): void;
    getLogs(): LogEntry[];
    clearLogs(): void;
}

class InMemoryLogger implements ILogger {
    private logs: LogEntry[] = [];

    log(entry: LogEntry): void {
        this.logs.push(entry);

        // Also log to console in development
        if (import.meta.env.DEV) {
            if (entry.success) {
                console.log(
                    `[${entry.serviceName}] ${entry.method}`,
                    entry.duration ? `(${entry.duration}ms)` : '',
                    entry.metadata || ''
                );
            } else {
                console.error(
                    `[${entry.serviceName}] ${entry.method}`,
                    entry.error,
                    entry.metadata
                );
            }
        }
    }

    getLogs(): LogEntry[] {
        return [...this.logs];
    }

    clearLogs(): void {
        this.logs = [];
    }
}

/**
 * Logging decorator - adds logging capabilities to any service
 */
export class LoggingDecorator<T extends IService> extends ServiceDecorator<T> {
    private logger: ILogger;

    constructor(service: T, logger?: ILogger) {
        super(service);
        this.logger = logger || new InMemoryLogger();
    }

    /**
     * Wraps a method with logging
     */
    async withLogging<R>(
        methodName: string,
        method: () => Promise<R>,
        metadata?: Record<string, unknown>
    ): Promise<R> {
        const startTime = performance.now();
        let result: R;
        let success = true;
        let error: Error | undefined;

        try {
            result = await method();
            return result;
        } catch (e) {
            success = false;
            error = e instanceof Error ? e : new Error(String(e));
            throw error;
        } finally {
            const duration = performance.now() - startTime;
            this.logger.log({
                timestamp: new Date(),
                serviceName: this.service.name,
                method: methodName,
                duration,
                success,
                error,
                metadata
            });
        }
    }

    getLogs(): LogEntry[] {
        return this.logger instanceof InMemoryLogger
            ? this.logger.getLogs()
            : [];
    }

    clearLogs(): void {
        if (this.logger instanceof InMemoryLogger) {
            this.logger.clearLogs();
        }
    }
}

// ============================================
// CACHING DECORATOR
// ============================================

export interface CacheEntry<T> {
    value: T;
    timestamp: Date;
    ttl: number; // Time to live in milliseconds
}

export interface ICache {
    get<T>(key: string): T | null;
    set<T>(key: string, value: T, ttl?: number): void;
    clear(): void;
    has(key: string): boolean;
    delete(key: string): void;
}

class InMemoryCache implements ICache {
    private cache = new Map<string, CacheEntry<unknown>>();

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        // Check if expired
        const now = Date.now();
        if (now - entry.timestamp.getTime() > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.value as T;
    }

    set<T>(key: string, value: T, ttl: number = 60000): void {
        this.cache.set(key, {
            value,
            timestamp: new Date(),
            ttl
        });
    }

    clear(): void {
        this.cache.clear();
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Remove expired entries
     */
    cleanup(): number {
        const now = Date.now();
        let removed = 0;

        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp.getTime() > entry.ttl) {
                this.cache.delete(key);
                removed++;
            }
        }

        return removed;
    }
}

/**
 * Caching decorator - adds caching capabilities to any service
 */
export class CachingDecorator<T extends IService> extends ServiceDecorator<T> {
    private cache: ICache;
    private defaultTTL: number;

    constructor(
        service: T,
        defaultTTL: number = 60000, // 1 minute default
        cache?: ICache
    ) {
        super(service);
        this.defaultTTL = defaultTTL;
        this.cache = cache || new InMemoryCache();
    }

    /**
     * Get cached value or compute and cache it
     */
    async withCache<R>(
        key: string,
        compute: () => Promise<R>,
        ttl?: number
    ): Promise<R> {
        // Check cache
        const cached = this.cache.get<R>(key);
        if (cached !== null) {
            return cached;
        }

        // Compute and cache
        const result = await compute();
        this.cache.set(key, result, ttl || this.defaultTTL);
        return result;
    }

    clearCache(): void {
        this.cache.clear();
    }

    hasCache(key: string): boolean {
        return this.cache.has(key);
    }

    invalidateCache(key: string): void {
        this.cache.delete(key);
    }

    cleanupCache(): number {
        return this.cache instanceof InMemoryCache
            ? this.cache.cleanup()
            : 0;
    }
}

// ============================================
// METRICS DECORATOR
// ============================================

export interface MetricEntry {
    timestamp: Date;
    serviceName: string;
    method: string;
    duration: number;
    success: boolean;
    metadata?: Record<string, unknown>;
}

export interface IMetricsCollector {
    record(entry: MetricEntry): void;
    getMetrics(filter?: { serviceName?: string; method?: string }): MetricEntry[];
    getAverageDuration(serviceName: string, method?: string): number;
    getSuccessRate(serviceName: string, method?: string): number;
    clear(): void;
}

class InMemoryMetricsCollector implements IMetricsCollector {
    private metrics: MetricEntry[] = [];

    record(entry: MetricEntry): void {
        this.metrics.push(entry);
    }

    getMetrics(filter?: { serviceName?: string; method?: string }): MetricEntry[] {
        let filtered = this.metrics;

        if (filter?.serviceName) {
            filtered = filtered.filter(m => m.serviceName === filter.serviceName);
        }

        if (filter?.method) {
            filtered = filtered.filter(m => m.method === filter.method);
        }

        return [...filtered];
    }

    getAverageDuration(serviceName: string, method?: string): number {
        const metrics = this.getMetrics({ serviceName, method });
        if (metrics.length === 0) return 0;

        const total = metrics.reduce((sum, m) => sum + m.duration, 0);
        return total / metrics.length;
    }

    getSuccessRate(serviceName: string, method?: string): number {
        const metrics = this.getMetrics({ serviceName, method });
        if (metrics.length === 0) return 0;

        const successful = metrics.filter(m => m.success).length;
        return (successful / metrics.length) * 100;
    }

    clear(): void {
        this.metrics = [];
    }
}

/**
 * Metrics decorator - adds performance metrics to any service
 */
export class MetricsDecorator<T extends IService> extends ServiceDecorator<T> {
    private collector: IMetricsCollector;

    constructor(service: T, collector?: IMetricsCollector) {
        super(service);
        this.collector = collector || new InMemoryMetricsCollector();
    }

    /**
     * Wrap method with metrics collection
     */
    async withMetrics<R>(
        methodName: string,
        method: () => Promise<R>,
        metadata?: Record<string, unknown>
    ): Promise<R> {
        const startTime = performance.now();
        let result: R;
        let success = true;

        try {
            result = await method();
            return result;
        } catch (error) {
            success = false;
            throw error;
        } finally {
            const duration = performance.now() - startTime;
            this.collector.record({
                timestamp: new Date(),
                serviceName: this.service.name,
                method: methodName,
                duration,
                success,
                metadata
            });
        }
    }

    getMetrics(filter?: { serviceName?: string; method?: string }): MetricEntry[] {
        return this.collector.getMetrics({ serviceName: this.service.name, ...filter });
    }

    getAverageDuration(method?: string): number {
        return this.collector.getAverageDuration(this.service.name, method);
    }

    getSuccessRate(method?: string): number {
        return this.collector.getSuccessRate(this.service.name, method);
    }

    clearMetrics(): void {
        this.collector.clear();
    }
}

// ============================================
// COMPOSITE DECORATOR
// ============================================

/**
 * Combines multiple decorators
 * Order: Metrics -> Logging -> Caching -> Service
 */
export class CompositeDecorator<T extends IService> extends ServiceDecorator<T> {
    private metrics: MetricsDecorator<T>;
    private logging: LoggingDecorator<T>;
    private caching: CachingDecorator<T>;

    constructor(
        service: T,
        options?: {
            enableMetrics?: boolean;
            enableLogging?: boolean;
            enableCaching?: boolean;
            cacheTTL?: number;
        }
    ) {
        super(service);

        // Create decorator chain (reverse order)
        const enableMetrics = options?.enableMetrics ?? true;
        const enableLogging = options?.enableLogging ?? true;
        const enableCaching = options?.enableCaching ?? true;

        this.metrics = new MetricsDecorator(service);
        this.logging = new LoggingDecorator(enableMetrics ? this.metrics : service);
        this.caching = new CachingDecorator(
            enableLogging ? this.logging : service,
            options?.cacheTTL
        );
    }

    /**
     * Execute with all decorators
     */
    async withDecorators<R>(
        methodName: string,
        compute: () => Promise<R>,
        options?: {
            cacheKey?: string;
            cacheTTL?: number;
            metadata?: Record<string, unknown>;
        }
    ): Promise<R> {
        const wrapped = async () => {
            return this.logging.withLogging(
                methodName,
                () => this.metrics.withMetrics(methodName, compute),
                options?.metadata
            );
        };

        if (options?.cacheKey) {
            return this.caching.withCache(options.cacheKey, wrapped, options.cacheTTL);
        }

        return wrapped();
    }

    getMetrics() {
        return this.metrics.getMetrics();
    }

    getLogs() {
        return this.logging.getLogs();
    }

    clearCache() {
        this.caching.clearCache();
    }

    clearAll() {
        this.metrics.clearMetrics();
        this.logging.clearLogs();
        this.caching.clearCache();
    }
}

// ============================================
// FACTORY FUNCTION
// ============================================

/**
 * Factory function to create decorated services
 */
export function createDecoratedService<T extends IService>(
    service: T,
    decorators: Array<'logging' | 'caching' | 'metrics'> = ['logging', 'metrics']
): T {
    let decorated: IService = service;

    // Apply decorators in reverse order (last = outermost)
    for (const decorator of [...decorators].reverse()) {
        switch (decorator) {
            case 'logging':
                decorated = new LoggingDecorator(decorated as any);
                break;
            case 'caching':
                decorated = new CachingDecorator(decorated as any);
                break;
            case 'metrics':
                decorated = new MetricsDecorator(decorated as any);
                break;
        }
    }

    return decorated as T;
}

// ============================================
// REACT HOOK
// ============================================

import { useEffect, useState } from 'react';

/**
 * React hook to use metrics from a decorated service
 */
export function useServiceMetrics(
    decorator: MetricsDecorator<any> | CompositeDecorator<any>,
    methodName?: string,
    interval: number = 5000
) {
    const [metrics, setMetrics] = useState({
        avgDuration: 0,
        successRate: 0,
        totalCalls: 0
    });

    useEffect(() => {
        const updateMetrics = () => {
            if (decorator instanceof MetricsDecorator) {
                setMetrics({
                    avgDuration: decorator.getAverageDuration(methodName),
                    successRate: decorator.getSuccessRate(methodName),
                    totalCalls: decorator.getMetrics(methodName).length
                });
            } else if (decorator instanceof CompositeDecorator) {
                const m = decorator.metrics;
                setMetrics({
                    avgDuration: m.getAverageDuration(methodName),
                    successRate: m.getSuccessRate(methodName),
                    totalCalls: m.getMetrics(methodName).length
                });
            }
        };

        updateMetrics();
        const intervalId = setInterval(updateMetrics, interval);

        return () => clearInterval(intervalId);
    }, [decorator, methodName, interval]);

    return metrics;
}

// ============================================
// EXPORTS
// ============================================

export type { LogEntry, ILogger, CacheEntry, ICache, MetricEntry, IMetricsCollector };
export { InMemoryLogger, InMemoryCache, InMemoryMetricsCollector };
