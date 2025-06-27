import chalk from 'chalk'

export class Logger {
  constructor(private readonly prefix: string) {}

  log(message: any, ...args: any[]) {
    console.log(`[${this.prefix}]`, message, ...args)
  }

  info(message: any, ...args: any[]) {
    console.info(chalk.blue(`[${this.prefix}]`, message), ...args)
  }

  warn(message: any, ...args: any[]) {
    console.warn(chalk.yellow(`[${this.prefix}]`, message), ...args)
  }

  error(message: any, ...args: any[]) {
    console.error(chalk.red(`[${this.prefix}]`, message), ...args)
  }

  debug(message: any, ...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(chalk.gray(`[${this.prefix}]`, message), ...args)
    }
  }

  success(message: any, ...args: any[]) {
    console.log(chalk.green(`[${this.prefix}]`, message), ...args)
  }
}
