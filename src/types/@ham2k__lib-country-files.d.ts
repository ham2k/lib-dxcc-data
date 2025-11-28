declare module '@ham2k/lib-country-files' {
  export interface CTYEntity {
    entityPrefix: string;
    dxccCode: number;
    isWAE?: boolean;
    [key: string]: any;
  }

  export interface BIGCTY {
    entities: Record<string, CTYEntity>;
    [key: string]: any;
  }

  export const BIGCTY: BIGCTY;
}

