import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//Utility function to convert a prisma object into a plain object
export function convertToPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

//Format number with decimal places
export function formatNumberWithDecimal (num: number ) : string {
  const [int, decimal ] = num.toString().split(".")
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` :  `${int}.00`
}

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if(error instanceof z.ZodError){
      const treeZodError = z.treeifyError(error);
      const prettyZodError = z.prettifyError(error);
      console.log('Treeified errors: ', treeZodError);
      console.log('Prettified errors: ', prettyZodError);
    // Handle Zod error
    // const fieldErrors = Object.keys(error.errors).map(
    //   (field) => error.errors[field].message
    // );

    // return fieldErrors.join('. ');
    
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    // Handle Prisma error
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  
  } else if ( error.name === "CredentialsSignin" || error.name === "CallbackRouteError") {
    
      return error.message || 'Something with the credentials';

  } else {
    // Handle other errors
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
}

// round number to two decimal places
export function round2(value: number | string ): number {
  if (typeof value === 'number') {
    //this changes a number to 2 decimal places
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Value is not a number or string');
  }
}

 const CURRENCY_FORMATTER = new Intl.NumberFormat('en-GB', {
  currency: 'GBP',
  style: 'currency',
  minimumFractionDigits: 2,
});

// Format currency using the currency formatter above

export function formatCurrency(amount: number | string | null)  {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return 'Nan';
  }
}