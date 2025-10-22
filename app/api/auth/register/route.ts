import { NextRequest, NextResponse } from 'next/server'
import { mockAuthService } from '@/lib/mock-auth-service'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Naam, email en wachtwoord zijn verplicht' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Wachtwoord moet minimaal 8 karakters lang zijn' },
        { status: 400 }
      )
    }

    // Use mock auth service for development
    const result = await mockAuthService.register(email, password, name)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      )
    }

    return NextResponse.json({
      success: true,
      user: result.user,
    })
  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij de registratie' },
      { status: 500 }
    )
  }
}
