declare module 'mammoth' {
  export interface MammothOptions {
    arrayBuffer: ArrayBuffer;
  }
  export interface MammothResult {
    value: string;
    messages: any[];
  }
  export function convertToHtml(options: MammothOptions): Promise<MammothResult>;
}
