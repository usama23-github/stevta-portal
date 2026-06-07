"use client";

import React from "react";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import Link from "next/link";

const SignInCard = () => {
  return (
    <Card className="w-full h-full md:w-121.75 border-none shadow-none py-10">
      <CardHeader className="flex-col items-center justify-center text-center px-7">
        <div className="flex items-center justify-center mb-4">
          <img src="/stevta-logo.png" height={100} width={100} alt="Logo" />
        </div>
        <CardTitle className="font-bold text-2xl text-blue-900">
          STEVTA
        </CardTitle>
        <p className="text-lg text-emerald-600">
          Management & Information System
        </p>
        <div className="px-7 mb-4">
          <Separator />
        </div>
        <CardTitle className="text-lg">Sign in to your account</CardTitle>
      </CardHeader>

      <CardContent className="px-7">
        <div className="space-y-4">
          <FieldSet className="w-full">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Email</FieldLabel>
                <Input
                  id="email"
                  className="h-12"
                  type="text"
                  placeholder="Enter your email address"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  className="h-12"
                  type="password"
                  placeholder="Enter your password"
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Link href="/college-dashboard/1">
            <Button size="lg" className="w-full h-12 mt-2">
              Sign in
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
