# Settings Components Documentation

## ProfileForm Component

### Purpose
Provides user profile management functionality with:
- Zod schema validation for profile data
- React Hook Form integration
- API submission handling
- Loading states and error feedback

### Key Features
1. **Validation Schema**:
```ts
const profileFormSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.string().email(),
  bio: z.string().max(160).optional(),
  company: z.string().max(50).optional()
})
```

2. **Form Initialization**:
```ts
const form = useForm<ProfileFormValues>({
  resolver: zodResolver(profileFormSchema),
  defaultValues: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Amazon seller...',
    company: 'Home Essentials LLC'
  },
  mode: 'onChange'
})
```

3. **Submission Handling**:
```ts
async function onSubmit(data: ProfileFormValues) {
  // API call to update profile
  await fetch('/api/settings/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}
```

### Usage Guidelines
1. Import component:
```tsx
import { ProfileForm } from '@/components/settings/profile-form'
```

2. Validation Rules:
- Name: 2-30 characters
- Email: Valid email format
- Bio: Optional (160 char max)
- Company: Optional (50 char max)

3. Integration Requirements:
- Requires @hookform/resolvers
- Depends on backend API endpoint (/api/settings/profile)
- Uses Sonner for toast notifications

4. Error Handling:
```tsx
const errorResponse = handleError(error)
toast.error(errorResponse.error.message, {
  description: errorResponse.error.details
})
```

### Component Structure
- Form fields for name, email, company, and bio
- Loading state during submission
- Responsive layout with spacing
- Input validation messages