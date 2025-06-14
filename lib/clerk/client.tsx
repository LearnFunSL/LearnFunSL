import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

// Export the ClerkProvider with a dark theme for a consistent UI.
// This can be customized to match your application's branding.
export const ClerkProviderWithTheme = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <ClerkProvider
    appearance={{
      baseTheme: dark,
    }}
  >
    {children}
  </ClerkProvider>
);
