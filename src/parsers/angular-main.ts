export abstract class Angular {
  public abstract readonly name: string;
  public abstract getVersion(): string;
  public abstract getEnvironment(): any;
}
