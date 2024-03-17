import { Authenticator } from "@/components/custom/authenticator";

export default function OrdersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <Authenticator>
      {children}
    </Authenticator>
    </>
  )
}