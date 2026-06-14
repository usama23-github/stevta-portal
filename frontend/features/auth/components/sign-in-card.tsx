"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

const SignInCard = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://portal.stevta.gos.pk/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);

      router.push("/college-dashboard/1");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full h-full md:w-121.75 border-none shadow-none py-10">
      <CardHeader className="flex-col items-center justify-center text-center px-7">
        <div className="flex items-center justify-center mb-4">
          <img
            src="/stevta-logo.png"
            height={100}
            width={100}
            alt="Logo"
          />
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

        <CardTitle className="text-lg">
          Sign in to your account
        </CardTitle>
      </CardHeader>

      <CardContent className="px-7">
        <div className="space-y-4">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  className="h-12"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  className="h-12"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <Button
            size="lg"
            className="w-full h-12 mt-2"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignInCard;