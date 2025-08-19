
"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { addMember } from "@/lib/repository_mock/members";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama tidak boleh kosong." }),
  email: z.string().email({ message: "Format email tidak valid." }).optional().or(z.literal('')),
  phoneNumber: z.string().min(1, { message: "Nomor telepon tidak boleh kosong." }),
  address: z.string().min(1, { message: "Alamat tidak boleh kosong." }),
  dateOfBirth: z.string().min(1, { message: "Tanggal lahir tidak boleh kosong." }),
  gender: z.enum(["Laki-laki", "Perempuan"], { required_error: "Jenis kelamin harus dipilih." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
  ulangiPassword: z.string().min(1, { message: "Ulangi password tidak boleh kosong." }),
}).refine(data => data.password === data.ulangiPassword, {
  message: "Password tidak cocok.",
  path: ["ulangiPassword"],
});

type FormValues = z.infer<typeof formSchema>;


export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: "",
      password: "",
      ulangiPassword: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const { ulangiPassword, ...newMemberData } = values;
      await addMember(newMemberData);
      toast({
        title: "Registrasi Berhasil",
        description: "Akun Anda telah berhasil dibuat. Silakan login.",
      });
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registrasi Gagal",
        description: "Terjadi kesalahan. Nomor telepon mungkin sudah terdaftar.",
      });
       setIsLoading(false);
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/login" passHref>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Registrasi</h1>
      </header>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nama" {...field} className="bg-secondary border-0 placeholder:text-foreground/60 h-12 rounded-lg" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email (Opsional)" {...field} className="bg-secondary border-0 placeholder:text-foreground/60 h-12 rounded-lg" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="tel" placeholder="Nomor Telepon (cth: 0812...)" {...field} className="bg-secondary border-0 placeholder:text-foreground/60 h-12 rounded-lg" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Alamat" {...field} className="bg-secondary border-0 placeholder:text-foreground/60 h-12 rounded-lg" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                   <div className="relative">
                      <FormLabel className="absolute left-3 top-[-0.6rem] bg-background px-1 text-xs text-foreground/60">Tanggal Lahir</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-secondary border-0 placeholder:text-foreground/60 h-12 rounded-lg text-foreground/60" disabled={isLoading} />
                      </FormControl>
                    </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-2 pt-2">
                  <FormLabel className="text-foreground/60">Jenis Kelamin</FormLabel>
                   <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-6 pt-2"
                        disabled={isLoading}
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="Laki-laki" id="r1" />
                          </FormControl>
                          <Label htmlFor="r1" className="font-normal">Laki-laki</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                           <FormControl>
                            <RadioGroupItem value="Perempuan" id="r2" />
                           </FormControl>
                          <Label htmlFor="r2" className="font-normal">Perempuan</Label>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password" 
                        {...field}
                        className="bg-secondary border-0 placeholder:text-foreground/60 h-12 rounded-lg pr-12" 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-foreground/60 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                   <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="ulangiPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Input 
                         type={showConfirmPassword ? "text" : "password"} 
                         placeholder="Ulangi Password" 
                        {...field}
                        className="bg-secondary border-0 placeholder:text-foreground/60 h-12 rounded-lg pr-12" 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-foreground/60 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="pb-16">
            <Button type="submit" className="w-full h-12 rounded-lg text-lg font-semibold" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Mendaftar..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
