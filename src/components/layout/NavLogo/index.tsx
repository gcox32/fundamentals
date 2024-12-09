"use client";

import React from "react";
import Image from "next/image";
import LogoProps from "./types";
import Link from "next/link";

export default function NavLogo({ width = 50, height = 50 }: LogoProps) {
    return (
        <div className="nav-logo">
            <Link href="/">
                <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={width}
                    height={height}
                    loading="eager"
                />
            </Link>
        </div>
    );
}
