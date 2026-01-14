/**
 * Web Worker Setup for Heavy Computations
 *
 * PERFORMANCE: Offload CPU-intensive tasks from main thread
 * - PDF generation blocks UI without workers
 * - Chart calculations can slow down rendering
 * - Data processing should not block interactions
 *
 * @performance
 * - Keeps main thread responsive (FID < 100ms)
 * - Enables parallel processing of heavy tasks
 * - Improves perceived performance and interactivity
 */

import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Hook for using Web Workers with clean API
 */
export function useWebWorker<T, R>(
  workerFn: (data: T) => R,
  dependencies: unknown[] = []
) {
  const workerRef = useRef<Worker | null>(null);
  const [result, setResult] = useState<R | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Create worker from function
    const blob = new Blob([`self.onmessage = (e) => { try { self.postMessage({ result: (${workerFn.toString()})(e.data) }); } catch (err) { self.postMessage({ error: err.message }); } }`], {
      type: 'application/javascript'
    });

    const worker = new Worker(URL.createObjectURL(blob));
    workerRef.current = worker;

    worker.onmessage = (e) => {
      if (e.data.error) {
        setError(new Error(e.data.error));
      } else {
        setResult(e.data.result);
      }
      setIsProcessing(false);
    };

    worker.onerror = (err) => {
      setError(new Error(err.message));
      setIsProcessing(false);
    };

    return () => {
      worker.terminate();
      URL.revokeObjectURL(URL.createObjectURL(blob));
    };
  }, dependencies);

  const execute = useCallback((data: T) => {
    if (!workerRef.current) {
      throw new Error('Worker not initialized');
    }

    setIsProcessing(true);
    setError(null);
    workerRef.current.postMessage(data);
  }, []);

  return { result, error, isProcessing, execute };
}

/**
 * Web Worker for PDF Generation
 * Offloads PDF creation to background thread
 */
export function createPDFWorker() {
  const workerCode = `
    let jsPDF = null;

    self.onmessage = async (e) => {
      const { type, data } = e.data;

      try {
        switch (type) {
          case 'init':
            // Lazy load jsPDF in worker
            const importScripts = ['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'];
            importScripts.forEach(script => self.importScript(script));
            jsPDF = self.jspdf.jsPDF;
            self.postMessage({ type: 'initialized' });
            break;

          case 'generatePDF':
            if (!jsPDF) throw new Error('jsPDF not initialized');

            const { content, options } = data;
            const doc = new jsPDF(options);

            // Add content to PDF
            if (content.text) {
              doc.text(content.text, 10, 10);
            }

            if (content.title) {
              doc.setFontSize(16);
              doc.text(content.title, 10, 20);
            }

            const pdfBlob = doc.output('arraybuffer');
            self.postMessage({
              type: 'pdfGenerated',
              data: pdfBlob
            }, [pdfBlob]);
            break;

          default:
            throw new Error(\`Unknown worker message type: \${type}\`);
        }
      } catch (err) {
        self.postMessage({
          type: 'error',
          error: err.message
        });
      }
    };
  `;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}

/**
 * React Hook for PDF Generation in Worker
 */
export function usePDFWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [pdfBlob, setPdfBlob] = useState<ArrayBuffer | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const worker = createPDFWorker();

    worker.onmessage = (e) => {
      const { type, data, error: workerError } = e.data;

      switch (type) {
        case 'initialized':
          console.log('[PDF Worker] Initialized');
          break;

        case 'pdfGenerated':
          setPdfBlob(data);
          setIsGenerating(false);
          break;

        case 'error':
          setError(new Error(workerError));
          setIsGenerating(false);
          break;
      }
    };

    worker.onerror = (err) => {
      setError(new Error(err.message));
      setIsGenerating(false);
    };

    // Initialize worker
    worker.postMessage({ type: 'init' });

    workerRef.current = worker;

    return () => {
      worker.terminate();
    };
  }, []);

  const generatePDF = useCallback((content: unknown, options: Record<string, unknown> = {}) => {
    if (!workerRef.current) {
      throw new Error('Worker not initialized');
    }

    setIsGenerating(true);
    setError(null);
    setPdfBlob(null);

    workerRef.current.postMessage({
      type: 'generatePDF',
      data: { content, options }
    });
  }, []);

  const downloadPDF = useCallback((filename = 'document.pdf') => {
    if (!pdfBlob) {
      throw new Error('No PDF generated yet');
    }

    const blob = new Blob([pdfBlob], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [pdfBlob]);

  return {
    pdfBlob,
    isGenerating,
    error,
    generatePDF,
    downloadPDF
  };
}

/**
 * Web Worker for Chart Data Processing
 */
export function createChartWorker() {
  const workerCode = `
    self.onmessage = (e) => {
      const { type, data } = e.data;

      try {
        switch (type) {
          case 'processData':
            const { rawData, aggregation } = data;

            // Heavy data processing
            let processedData;

            switch (aggregation) {
              case 'daily':
                processedData = aggregateByDay(rawData);
                break;

              case 'weekly':
                processedData = aggregateByWeek(rawData);
                break;

              case 'monthly':
                processedData = aggregateByMonth(rawData);
                break;

              default:
                processedData = rawData;
            }

            self.postMessage({
              type: 'dataProcessed',
              data: processedData
            });
            break;

          case 'calculateMetrics':
            const metrics = calculateMetrics(data);
            self.postMessage({
              type: 'metricsCalculated',
              data: metrics
            });
            break;

          default:
            throw new Error(\`Unknown type: \${type}\`);
        }
      } catch (err) {
        self.postMessage({
          type: 'error',
          error: err.message
        });
      }
    };

    function aggregateByDay(data) {
      const grouped = {};
      data.forEach(item => {
        const date = new Date(item.date).toDateString();
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(item);
      });

      return Object.entries(grouped).map(([date, items]) => ({
        date,
        value: items.reduce((sum, item) => sum + item.value, 0),
        count: items.length
      }));
    }

    function aggregateByWeek(data) {
      // Similar implementation for weekly aggregation
      return aggregateByDay(data); // Simplified
    }

    function aggregateByMonth(data) {
      // Similar implementation for monthly aggregation
      return aggregateByDay(data); // Simplified
    }

    function calculateMetrics(data) {
      return {
        total: data.reduce((sum, item) => sum + item.value, 0),
        average: data.reduce((sum, item) => sum + item.value, 0) / data.length,
        min: Math.min(...data.map(item => item.value)),
        max: Math.max(...data.map(item => item.value))
      };
    }
  `;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}

/**
 * React Hook for Chart Data Processing in Worker
 */
export function useChartWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const worker = createChartWorker();

    worker.onmessage = (e) => {
      const { type, data, error: workerError } = e.data;

      switch (type) {
        case 'dataProcessed':
          setProcessedData(data);
          setIsProcessing(false);
          break;

        case 'metricsCalculated':
          setProcessedData(data);
          setIsProcessing(false);
          break;

        case 'error':
          setError(new Error(workerError));
          setIsProcessing(false);
          break;
      }
    };

    worker.onerror = (err) => {
      setError(new Error(err.message));
      setIsProcessing(false);
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
    };
  }, []);

  const processData = useCallback((rawData: unknown[], aggregation: 'daily' | 'weekly' | 'monthly' = 'daily') => {
    if (!workerRef.current) {
      throw new Error('Worker not initialized');
    }

    setIsProcessing(true);
    setError(null);

    workerRef.current.postMessage({
      type: 'processData',
      data: { rawData, aggregation }
    });
  }, []);

  return {
    processedData,
    isProcessing,
    error,
    processData
  };
}
