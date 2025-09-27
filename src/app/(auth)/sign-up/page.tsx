import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex justify-center">
      <SignUp 
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
