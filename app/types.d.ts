declare module "jspdf" {
  export class jsPDF {
    constructor(options?: {
      orientation?: "portrait" | "landscape";
      unit?: "pt" | "mm" | "cm" | "in" | "px";
      format?: string | [number, number];
      compress?: boolean;
    });

    internal: {
      pageSize: {
        getWidth: () => number;
        getHeight: () => number;
      };
    };

    addPage(): jsPDF;
    
    addImage(
      imageData: string,
      format: string,
      x: number,
      y: number,
      width: number,
      height: number
    ): jsPDF;
    
    save(filename: string): jsPDF;
  }
}

declare module "html2canvas" {
  interface Html2CanvasOptions {
    /** Scale to use for rendering */
    scale?: number;
    /** Whether to enable CORS images */
    useCORS?: boolean;
    /** Whether to allow tainting with cross-origin images */
    allowTaint?: boolean;
    /** Background color */
    backgroundColor?: string;
    /** Whether to log */
    logging?: boolean;
    /** Width of window */
    windowWidth?: number;
  }

  interface Canvas {
    width: number;
    height: number;
    toDataURL(type?: string, quality?: number): string;
  }

  export default function html2canvas(
    element: HTMLElement,
    options?: Html2CanvasOptions
  ): Promise<Canvas>;
}