import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex justify-center">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-electric-blue hover:bg-electric-blue-hover',
            card: 'shadow-lg',
          }
        }}
      />
    </div>
  )
}
