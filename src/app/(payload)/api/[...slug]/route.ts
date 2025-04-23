/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'
import { NextRequest, NextResponse } from 'next/server'

// Customize REST functions for enhanced handling
const customRESTHandler = (originalHandler: any) => {
  return async (req: NextRequest, context: any) => {
    try {
      // Must await the params due to Next.js requirements
      const params = await Promise.resolve(context.params)

      // Safely access and join the slug array with proper await
      const slugArr = params?.slug ? await Promise.all([...params.slug]) : []
      const slugPath = Array.isArray(slugArr) ? slugArr.join('/') : ''

      console.log('[Payload catchall] Processing API request:', slugPath)

      // For users/signup route, return next response to allow App Router handling
      if (slugPath === 'users/signup') {
        console.log('[Payload catchall] Skipping users/signup, allowing Next.js handler')
        return NextResponse.next()
      }

      // For all other routes, use the original handler with proper error checking
      try {
        const result = await originalHandler(req, { params })

        // Ensure a response is always returned
        return result || NextResponse.json({ message: 'No response from handler' }, { status: 500 })
      } catch (handlerError) {
        console.error('[Payload catchall] Handler error:', handlerError)
        return NextResponse.json(
          { error: 'API handler error', details: String(handlerError) },
          { status: 500 },
        )
      }
    } catch (error) {
      console.error('[Payload catchall] General error:', error)
      return NextResponse.json(
        { error: 'Internal Server Error', details: String(error) },
        { status: 500 },
      )
    }
  }
}

export const GET = REST_GET(config)
export const POST = customRESTHandler(REST_POST(config))
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
