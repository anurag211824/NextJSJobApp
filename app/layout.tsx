import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        
      >
       <AppProvider>
     <Header/>
         {children}
       </AppProvider>
      </body>
    </html>
  );
}
