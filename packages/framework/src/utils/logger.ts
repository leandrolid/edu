import chalk from 'chalk'

export class Logger {
  constructor(private readonly prefix: string) {}

  log(message: string, ...args: any[]) {
    console.log(`[${this.prefix}] ${message}`, ...args)
  }

  info(message: string, ...args: any[]) {
    console.info(chalk.blue(`[${this.prefix}] ${message}`), ...args)
  }

  warn(message: string, ...args: any[]) {
    console.warn(chalk.yellow(`[${this.prefix}] ${message}`), ...args)
  }

  error(message: string, ...args: any[]) {
    console.error(chalk.red(`[${this.prefix}] ${message}`), ...args)
  }

  debug(message: string, ...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(chalk.gray(`[${this.prefix}] ${message}`), ...args)
    }
  }

  success(message: string, ...args: any[]) {
    console.log(chalk.green(`[${this.prefix}] ${message}`), ...args)
  }
}
