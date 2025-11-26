import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSessionUserWithPermissions } from "@/lib/org"
import { checkOrgAdmin, requirePermission } from "@/lib/permissions"

// GET /api/org-admin/users - list users in caller's organization; ORG_ADMIN only
export async function GET(req: Request) {
  try {
    const user = await getSessionUserWithPermissions()
    checkOrgAdmin(user.role)
    if (!user.organizationId) {
      return NextResponse.json([], { status: 200 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')

    const where: any = { organizationId: user.organizationId }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organizationId: true,
        createdAt: true,
        _count: {
          select: {
            createdTasks: true,
            assignedTasks: true,
            sentMessages: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(users)
  } catch (error: any) {
    console.error('Org-admin users list error', error)
    return NextResponse.json({ message: error.message || 'Failed' }, { status: error.status || 500 })
  }
}

// POST /api/org-admin/users - create user inside own organization
export async function POST(req: Request) {
  try {
    const user = await getSessionUserWithPermissions()
    checkOrgAdmin(user.role)
    requirePermission(user.role, 'ORG_USERS_MANAGE', user.isSuperAdmin)
    if (!user.organizationId) {
      const err: any = new Error('No organization bound to admin')
      err.status = 400
      throw err
    }
    let name: any, email: any, role: any, password: any, departmentId: any
    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const fd = await req.formData()
      name = fd.get('name')
      email = fd.get('email')
      role = fd.get('role') || 'EMPLOYEE'
      password = fd.get('password')
      departmentId = fd.get('departmentId') || null
    } else {
      const data = await req.json()
      name = data?.name
      email = data?.email
      role = data?.role || 'EMPLOYEE'
      password = data?.password
      departmentId = data?.departmentId || null
    }
    if (!email) {
      return NextResponse.json({ message: 'Email required' }, { status: 400 })
    }
    const bcrypt = require('bcryptjs')
    const hashed = await bcrypt.hash(password || 'ChangeMe123!', 10)
    // Validate department exists (Department is global; no org linkage in schema)
    if (departmentId) {
      const dept = await db.department.findUnique({ where: { id: String(departmentId) }, select: { id: true } })
      if (!dept) departmentId = null
    }

    const created = await db.user.create({
      data: {
        name: name || null,
        email,
        password: hashed,
        role,
        organizationId: user.organizationId,
        departmentId: departmentId ? String(departmentId) : undefined,
      },
      select: { id: true, name: true, email: true, role: true, organizationId: true, departmentId: true, createdAt: true }
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error: any) {
    console.error('Org-admin create user error', error)
    return NextResponse.json({ message: error.message || 'Failed' }, { status: error.status || 500 })
  }
}