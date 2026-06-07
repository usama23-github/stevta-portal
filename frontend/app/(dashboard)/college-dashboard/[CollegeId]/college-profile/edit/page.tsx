"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CollegeProfileEditPage = () => {
  const router = useRouter();

  // 🔐 Fake auth check (replace with real logic)
  const user = {};

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    }
  }, [user, router]);

  const form = useForm({
    defaultValues: {
      ddoCode: "",
      collegeName: "",
      collegeType: "",
      collegeShift: "",
      collegeRegion: "",
      collegeDistrict: "",
      collegeSubdivision: "",
      collegeUcName: "",
      collegeAreaType: "",
      collegeYearOfEstablishment: "",
      collegePhoneNo: "",
      collegeEmail: "",
      collegePrincipal: "",
      collegePrincipalStatus: "",
      collegeDDO: "",
      collegeITFocalPerson: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex px-4">
        <CardTitle className="text-xl font-bold">
          Edit College Profile
        </CardTitle>
      </CardHeader>

      <div className="px-4">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-6">
              <FormField
                control={form.control}
                name="ddoCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DDO Code</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12"
                        {...field}
                        placeholder="Enter ddo code"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Name</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12"
                        {...field}
                        placeholder="Enter college name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Type</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select College Type" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={"INTERMEDIATE"}>
                          INTERMEDIATE
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegeShift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Shift</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select College Shift" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={"MORNING"}>MORNING</SelectItem>
                        <SelectItem value={"EVENING"}>EVENING</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegeRegion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Region</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select College Region" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={"KARACHI"}>KARACHI</SelectItem>
                        <SelectItem value={"HYDERABAD"}>HYDERABAD</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegeDistrict"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College District</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select College District" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={"KARACHI SOUTH"}>
                          KARACHI SOUTH
                        </SelectItem>
                        <SelectItem value={"KARACHI EAST"}>
                          KARACHI EAST
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegeSubdivision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Subdivision</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select College Subdivision" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={"CLIFTON"}>CLIFTON</SelectItem>
                        <SelectItem value={"SADDAR"}>SADDAR</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegeUcName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UC Name</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12"
                        {...field}
                        placeholder="Enter uc name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegeAreaType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Area Type</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select College Area Type" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={"URBAN"}>URBAN</SelectItem>
                        <SelectItem value={"RURAL"}>RURAL</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegeYearOfEstablishment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Year of Establishment</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12"
                        {...field}
                        placeholder="Enter College Year of Establishment"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegePhoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Phone no</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12"
                        {...field}
                        placeholder="Enter College Phone no"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegeEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Email</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12"
                        {...field}
                        placeholder="Enter College Email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegePrincipal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Principal</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select College Principal" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={"1"}></SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collegePrincipalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Principal Status</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select College Principal Status" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={"NOTIFIED"}>NOTIFIED</SelectItem>
                        <SelectItem value={"IN-CHARGED"}>IN-CHARGED</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collegeDDO"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College DDO</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select College DDO" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={"1"}></SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collegeITFocalPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College IT Focal Person</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select College IT Focal Person" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={"1"}></SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-black text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CollegeProfileEditPage;
