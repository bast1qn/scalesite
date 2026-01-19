// ============================================
// COMMAND PATTERN
// Encapsulates requests as objects for undo/redo and queuing
// ============================================

// ============================================
// INTERFACES
// ============================================

/**
 * Command interface - all commands must implement this
 */
export interface ICommand {
    /**
     * Execute the command
     */
    execute(): Promise<void> | void;

    /**
     * Undo the command
     */
    undo(): Promise<void> | void;

    /**
     * Check if command can be undone
     */
    canUndo(): boolean;

    /**
     * Get command description for UI
     */
    getDescription(): string;

    /**
     * Get command timestamp
     */
    getTimestamp(): Date;
}

/**
 * Abstract base command with common functionality
 */
export abstract class BaseCommand implements ICommand {
    protected readonly timestamp: Date;
    protected executed: boolean = false;

    constructor(protected description: string) {
        this.timestamp = new Date();
    }

    abstract execute(): Promise<void> | void;
    abstract undo(): Promise<void> | void;

    canUndo(): boolean {
        return this.executed;
    }

    getDescription(): string {
        return this.description;
    }

    getTimestamp(): Date {
        return this.timestamp;
    }

    protected markAsExecuted(): void {
        this.executed = true;
    }
}

// ============================================
// COMMAND HISTORY
// ============================================

export interface ICommandHistory {
    executeCommand(command: ICommand): Promise<void>;
    undo(): Promise<void>;
    redo(): Promise<void>;
    canUndo(): boolean;
    canRedo(): boolean;
    clear(): void;
    getHistory(): readonly ICommand[];
    getCurrentPosition(): number;
}

/**
 * Command history with undo/redo support
 */
export class CommandHistory implements ICommandHistory {
    private history: ICommand[] = [];
    private currentPosition: number = -1;
    private maxHistorySize: number;

    constructor(maxHistorySize: number = 100) {
        this.maxHistorySize = maxHistorySize;
    }

    async executeCommand(command: ICommand): Promise<void> {
        // Execute the command
        await command.execute();

        // Remove any commands after current position (they will be redone)
        if (this.currentPosition < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentPosition + 1);
        }

        // Add command to history
        this.history.push(command);

        // Enforce max history size
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        } else {
            this.currentPosition++;
        }
    }

    async undo(): Promise<void> {
        if (!this.canUndo()) {
            throw new Error('Cannot undo: no command to undo');
        }

        const command = this.history[this.currentPosition];
        await command.undo();
        this.currentPosition--;
    }

    async redo(): Promise<void> {
        if (!this.canRedo()) {
            throw new Error('Cannot redo: no command to redo');
        }

        this.currentPosition++;
        const command = this.history[this.currentPosition];
        await command.execute();
    }

    canUndo(): boolean {
        return this.currentPosition >= 0;
    }

    canRedo(): boolean {
        return this.currentPosition < this.history.length - 1;
    }

    clear(): void {
        this.history = [];
        this.currentPosition = -1;
    }

    getHistory(): readonly ICommand[] {
        return this.history;
    }

    getCurrentPosition(): number {
        return this.currentPosition;
    }
}

// ============================================
// MACRO COMMAND
// ============================================

/**
 * Macro command - executes multiple commands as one
 */
export class MacroCommand extends BaseCommand {
    private commands: ICommand[] = [];

    constructor(description: string) {
        super(description);
    }

    addCommand(command: ICommand): void {
        if (this.executed) {
            throw new Error('Cannot add command to executed macro');
        }
        this.commands.push(command);
    }

    async execute(): Promise<void> {
        for (const command of this.commands) {
            await command.execute();
        }
        this.markAsExecuted();
    }

    async undo(): Promise<void> {
        // Undo in reverse order
        for (let i = this.commands.length - 1; i >= 0; i--) {
            await this.commands[i].undo();
        }
    }

    canUndo(): boolean {
        return this.commands.length > 0 && this.executed;
    }
}

// ============================================
// GENERIC COMMANDS
// ============================================

/**
 * Lambda command - created from functions
 */
export class LambdaCommand extends BaseCommand {
    constructor(
        description: string,
        private executeFn: () => Promise<void> | void,
        private undoFn: () => Promise<void> | void
    ) {
        super(description);
    }

    async execute(): Promise<void> {
        await this.executeFn();
        this.markAsExecuted();
    }

    async undo(): Promise<void> {
        await this.undoFn();
    }
}

/**
 * Property change command - for updating object properties
 */
export class PropertyChangeCommand<T, K extends keyof T> extends BaseCommand {
    constructor(
        private obj: T,
        private property: K,
        private newValue: T[K],
        private oldValue?: T[K]
    ) {
        super(`Change ${String(property)} from ${oldValue} to ${newValue}`);
    }

    async execute(): Promise<void> {
        // Store old value if not already stored
        if (this.oldValue === undefined) {
            this.oldValue = this.obj[this.property];
        }

        this.obj[this.property] = this.newValue;
        this.markAsExecuted();
    }

    async undo(): Promise<void> {
        if (this.oldValue !== undefined) {
            this.obj[this.property] = this.oldValue;
        }
    }
}

/**
 * Array operations command
 */
export class ArrayCommand<T> extends BaseCommand {
    constructor(
        private array: T[],
        private operation: 'add' | 'remove' | 'replace',
        private item: T,
        private index?: number,
        private oldItem?: T
    ) {
        super(`${operation} item at ${index || 'end'}`);
    }

    async execute(): Promise<void> {
        switch (this.operation) {
            case 'add':
                if (this.index !== undefined) {
                    this.array.splice(this.index, 0, this.item);
                } else {
                    this.array.push(this.item);
                }
                break;
            case 'remove':
                if (this.index !== undefined) {
                    this.oldItem = this.array.splice(this.index, 1)[0];
                } else {
                    const idx = this.array.indexOf(this.item);
                    if (idx !== -1) {
                        this.oldItem = this.array.splice(idx, 1)[0];
                    }
                }
                break;
            case 'replace':
                if (this.index !== undefined) {
                    this.oldItem = this.array[this.index];
                    this.array[this.index] = this.item;
                }
                break;
        }
        this.markAsExecuted();
    }

    async undo(): Promise<void> {
        switch (this.operation) {
            case 'add':
                if (this.index !== undefined) {
                    this.array.splice(this.index, 1);
                } else {
                    this.array.pop();
                }
                break;
            case 'remove':
                if (this.index !== undefined && this.oldItem) {
                    this.array.splice(this.index, 0, this.oldItem);
                } else if (this.oldItem) {
                    this.array.push(this.oldItem);
                }
                break;
            case 'replace':
                if (this.index !== undefined && this.oldItem !== undefined) {
                    this.array[this.index] = this.oldItem;
                }
                break;
        }
    }
}

// ============================================
// COMMAND QUEUE
// ============================================

export interface ICommandQueue {
    enqueue(command: ICommand): void;
    dequeue(): ICommand | null;
    peek(): ICommand | null;
    getSize(): number;
    clear(): void;
    processAll(): Promise<void>;
}

/**
 * Command queue for sequential execution
 */
export class CommandQueue implements ICommandQueue {
    private queue: ICommand[] = [];
    private isProcessing: boolean = false;

    enqueue(command: ICommand): void {
        this.queue.push(command);
    }

    dequeue(): ICommand | null {
        return this.queue.shift() || null;
    }

    peek(): ICommand | null {
        return this.queue[0] || null;
    }

    getSize(): number {
        return this.queue.length;
    }

    clear(): void {
        this.queue = [];
    }

    async processAll(): Promise<void> {
        if (this.isProcessing) {
            throw new Error('Queue is already being processed');
        }

        this.isProcessing = true;
        const errors: Error[] = [];

        try {
            while (this.queue.length > 0) {
                const command = this.dequeue();
                if (command) {
                    try {
                        await command.execute();
                    } catch (error) {
                        errors.push(error instanceof Error ? error : new Error(String(error)));
                    }
                }
            }
        } finally {
            this.isProcessing = false;
        }

        if (errors.length > 0) {
            throw new AggregateError(
                errors,
                `Failed to execute ${errors.length} command(s)`
            );
        }
    }
}

// ============================================
// REACT HOOKS
// ============================================

import { useCallback, useEffect, useState } from 'react';

/**
 * React hook for command history
 */
export function useCommandHistory(maxHistorySize: number = 100) {
    const [history] = useState(() => new CommandHistory(maxHistorySize));
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [commandList, setCommandList] = useState<readonly ICommand[]>([]);

    const executeCommand = useCallback(async (command: ICommand) => {
        await history.executeCommand(command);
        setCanUndo(history.canUndo());
        setCanRedo(history.canRedo());
        setCommandList(history.getHistory());
    }, [history]);

    const undo = useCallback(async () => {
        await history.undo();
        setCanUndo(history.canUndo());
        setCanRedo(history.canRedo());
    }, [history]);

    const redo = useCallback(async () => {
        await history.redo();
        setCanUndo(history.canUndo());
        setCanRedo(history.canRedo());
    }, [history]);

    const clear = useCallback(() => {
        history.clear();
        setCanUndo(false);
        setCanRedo(false);
        setCommandList([]);
    }, [history]);

    return {
        executeCommand,
        undo,
        redo,
        clear,
        canUndo,
        canRedo,
        history: commandList,
        currentPosition: history.getCurrentPosition()
    };
}

/**
 * React hook for command queue
 */
export function useCommandQueue() {
    const [queue] = useState(() => new CommandQueue());
    const [size, setSize] = useState(0);

    const enqueue = useCallback((command: ICommand) => {
        queue.enqueue(command);
        setSize(queue.getSize());
    }, [queue]);

    const processAll = useCallback(async () => {
        await queue.processAll();
        setSize(queue.getSize());
    }, [queue]);

    const clear = useCallback(() => {
        queue.clear();
        setSize(0);
    }, [queue]);

    return {
        enqueue,
        processAll,
        clear,
        size,
        isEmpty: size === 0
    };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create a command from functions
 */
export function createCommand(
    description: string,
    execute: () => Promise<void> | void,
    undo: () => Promise<void> | void
): ICommand {
    return new LambdaCommand(description, execute, undo);
}

/**
 * Create a property change command
 */
export function createPropertyCommand<T, K extends keyof T>(
    obj: T,
    property: K,
    newValue: T[K]
): ICommand {
    return new PropertyChangeCommand(obj, property, newValue);
}

/**
 * Create an array add command
 */
export function createArrayAddCommand<T>(
    array: T[],
    item: T,
    index?: number
): ICommand {
    return new ArrayCommand(array, 'add', item, index);
}

/**
 * Create an array remove command
 */
export function createArrayRemoveCommand<T>(
    array: T[],
    item: T,
    index?: number
): ICommand {
    return new ArrayCommand(array, 'remove', item, index);
}

/**
 * Create a macro command
 */
export function createMacroCommand(
    description: string,
    commands: ICommand[] = []
): ICommand {
    const macro = new MacroCommand(description);
    commands.forEach(cmd => macro.addCommand(cmd));
    return macro;
}

// ============================================
// EXPORTS
// ============================================

// All exports are defined inline above - no duplicate exports needed
