import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// =============================================
// PUT /api/settings/profile
// Memperbarui nama dan kata sandi dari Akun Login
// =============================================
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Verifikasi Auth - Berlaku untuk ADMIN, TEAM, maupun CLIENT
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, password } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Nama tidak boleh kosong" }, { status: 400 });
    }

    const updateData: { name: string; password?: string } = {
      name: name,
    };

    // Jika user menginputkan password baru, lakukan hashing
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password.trim(), salt);
    }

    // Melakukan update via Prisma
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // Menghindari mengirimkan password kembali di response API
    return NextResponse.json(
      {
        message: "Profil sukses diperbarui",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SETTINGS_PROFILE_PUT]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat memperbarui profil" },
      { status: 500 }
    );
  }
}
