import { NextResponse } from 'next/server'

import getOrCreateDB from './models/sever/dbsetup'
import getOrCreateStorage from './models/sever/storagesetup'

export async function middleware() { // Using the generic `Request` type
  await Promise.all([getOrCreateDB(), getOrCreateStorage()])
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
