import { Zero, type TableSchema, type ZeroOptions } from '@rocicorp/zero';
import { atom } from 'nanostores';

export type Schema = {
  readonly version: number;
  readonly tables: { readonly [table: string]: TableSchema };
};

export class Z<TSchema extends Schema> {
  private static instance: Z<any> | null = null;
  current = atom<Zero<TSchema> | null>(null);

  constructor(z_options: ZeroOptions<TSchema>) {
    this.build(z_options);
  }

  static getInstance<TSchema extends Schema>(z_options?: ZeroOptions<TSchema>): Z<TSchema> {
    if (!this.instance && z_options) {  
      this.instance = new Z(z_options);
    }
    return this.instance as Z<TSchema>;
  }

  private build(z_options: ZeroOptions<TSchema>) {
    this.current.set(new Zero(z_options));
  }

  close() {
    const currentZero = this.current.get();
    if (currentZero) {
      currentZero.close();
      this.current.set(null);
    }
    Z.instance = null;
  }
}
