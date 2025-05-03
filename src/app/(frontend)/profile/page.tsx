'use client'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, token, refreshUser } = useAuth()
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '')
  const [profileImage, setProfileImage] = useState(user?.profileImage || null)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // สำหรับฟอร์มเปลี่ยนรหัสผ่าน
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  // sync state เมื่อ user เปลี่ยน (เช่น refreshUser)
  useEffect(() => {
    setFirstName(user?.firstName || '')
    setLastName(user?.lastName || '')
    setPhoneNumber(user?.phoneNumber || '')
    setProfileImage(user?.profileImage || null)
  }, [user])

  // อัปเดตข้อมูลผู้ใช้
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      if (!user || !token) throw new Error('ไม่พบข้อมูลผู้ใช้หรือ token')
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phoneNumber,
          profileImage:
            profileImage && typeof profileImage === 'object' ? profileImage.id : profileImage,
        }),
      })
      if (!res.ok) throw new Error('บันทึกข้อมูลไม่สำเร็จ')
      setSuccess('บันทึกข้อมูลสำเร็จ')
      setEditMode(false)
      await refreshUser()
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setSaving(false)
    }
  }

  // อัปโหลดรูปโปรไฟล์
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !token) return
    setError('')
    setSuccess('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { Authorization: `JWT ${token}` },
        body: formData,
      })
      if (!res.ok) throw new Error('อัปโหลดรูปไม่สำเร็จ')
      const data = await res.json()
      // data.id หรือ data.url
      setProfileImage(data.id)
      // patch user profileImage
      if (user) {
        await fetch(`/api/users/${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${token}`,
          },
          body: JSON.stringify({ profileImage: data.id }),
        })
        await refreshUser()
        setSuccess('เปลี่ยนรูปโปรไฟล์สำเร็จ')
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูป')
    }
  }

  // เปลี่ยนรหัสผ่าน (PATCH users/[id] หรือสร้าง endpoint เฉพาะ)
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')
    setPwLoading(true)
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwError('กรุณากรอกข้อมูลให้ครบถ้วน')
      setPwLoading(false)
      return
    }
    if (newPassword.length < 8) {
      setPwError('รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร')
      setPwLoading(false)
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน')
      setPwLoading(false)
      return
    }
    try {
      if (!user || !token) throw new Error('ไม่พบข้อมูลผู้ใช้หรือ token')
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({ password: newPassword, oldPassword }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ')
      }
      setPwSuccess('เปลี่ยนรหัสผ่านสำเร็จ')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setPwError(err.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน')
    } finally {
      setPwLoading(false)
    }
  }

  if (!user) {
    return <div className="p-8 text-center">กรุณาเข้าสู่ระบบ</div>
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-[#0a1925] p-8 rounded-lg border border-gray-800 text-white relative">
      {/* ปุ่มกลับหน้า Home */}
      <Link
        href="/home"
        className="absolute right-4 top-4 text-2xl hover:text-blue-400 transition-colors"
        title="กลับหน้าแรก"
      >
        <span role="img" aria-label="home">
          🏠
        </span>
      </Link>
      <h1 className="text-2xl font-bold mb-6">โปรไฟล์ผู้ใช้</h1>
      <div className="flex flex-col items-center mb-6">
        {/* รูปโปรไฟล์ */}
        <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mb-2">
          {profileImage ? (
            <img
              src={
                typeof profileImage === 'object' ? profileImage.url : `/api/media/${profileImage}`
              }
              alt="รูปโปรไฟล์"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl">👤</span>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="profileImageUpload"
          onChange={handleImageChange}
        />
        <label
          htmlFor="profileImageUpload"
          className="text-blue-400 hover:underline cursor-pointer text-xs"
        >
          เปลี่ยนรูปโปรไฟล์
        </label>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <Label htmlFor="firstName">ชื่อ</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={!editMode}
          />
        </div>
        <div>
          <Label htmlFor="lastName">นามสกุล</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={!editMode}
          />
        </div>
        <div>
          <Label htmlFor="email">อีเมล</Label>
          <Input id="email" value={user.email} disabled />
        </div>
        <div>
          <Label htmlFor="phoneNumber">เบอร์โทรศัพท์</Label>
          <Input
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={!editMode}
          />
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        {success && <div className="text-green-400 text-sm">{success}</div>}
        <div className="flex gap-2 mt-4">
          {editMode ? (
            <>
              <Button type="submit" disabled={saving}>
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setEditMode(false)}>
                ยกเลิก
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setEditMode(true)}>
              แก้ไขข้อมูล
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="ml-auto"
            onClick={() => setShowPasswordForm((v) => !v)}
          >
            เปลี่ยนรหัสผ่าน
          </Button>
        </div>
      </form>
      {/* ฟอร์มเปลี่ยนรหัสผ่าน */}
      {showPasswordForm && (
        <form
          onSubmit={handleChangePassword}
          className="mt-8 bg-[#132235] p-6 rounded-lg border border-gray-700"
        >
          <h2 className="text-lg font-semibold mb-4">เปลี่ยนรหัสผ่าน</h2>
          <div className="mb-3">
            <Label htmlFor="oldPassword">รหัสผ่านเดิม</Label>
            <Input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <div className="text-xs text-gray-400 mt-1">รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร</div>
          </div>
          <div className="mb-3">
            <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {pwError && <div className="text-red-400 text-sm mb-2">{pwError}</div>}
          {pwSuccess && <div className="text-green-400 text-sm mb-2">{pwSuccess}</div>}
          <div className="flex gap-2 mt-2">
            <Button type="submit" disabled={pwLoading}>
              {pwLoading ? 'กำลังเปลี่ยน...' : 'เปลี่ยนรหัสผ่าน'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowPasswordForm(false)}>
              ยกเลิก
            </Button>
          </div>
        </form>
      )}
      <div className="mt-8 border-t border-gray-700 pt-6">
        <h2 className="text-lg font-semibold mb-2">ฟีเจอร์อื่นๆ</h2>
        <ul className="space-y-2 text-blue-400 text-sm">
          <li>
            <Link href="/order-history" className="hover:underline">
              ประวัติการซื้อ
            </Link>
          </li>
          <li>
            <Link href="/track-system" className="hover:underline">
              ระบบติดตามผล
            </Link>
          </li>
          {/* เพิ่มฟีเจอร์อื่นๆ ได้ที่นี่ */}
        </ul>
      </div>
    </div>
  )
}
