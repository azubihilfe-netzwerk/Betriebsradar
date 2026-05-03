# Review Form Components

A reusable, multi-page React form system for creating and editing experience reviews with consistent styling.

## Structure

```
src/
├── components/
│   ├── Form/                 # Reusable form field components
│   │   ├── Button.tsx        # Primary, secondary, danger button variants
│   │   ├── FormField.tsx     # Text input with label, error, helper text
│   │   ├── SelectField.tsx   # Select dropdown with label, error, helper text
│   │   ├── CheckboxField.tsx # Checkbox with label, error, helper text
│   │   ├── TextAreaField.tsx # Textarea with label, error, helper text
│   │   └── index.ts          # Barrel export
│   └── ReviewForm/
│       ├── ReviewForm.tsx    # Main multi-page form component
│       └── index.ts          # Exports and types
├── hooks/
│   └── useReviewSubmit.ts    # Hook for handling form submission
└── examples/
    └── ReviewFormExample.tsx # Complete example with Apollo Client
```

## Components

### Reusable Form Fields

All form field components are built with consistent styling and error handling:

#### Button
```tsx
import { Button } from './components/Form';

<Button variant="primary" size="md" isLoading={false}>
  Click me
</Button>

// Variants: 'primary' | 'secondary' | 'danger'
// Sizes: 'sm' | 'md' | 'lg'
```

#### FormField (Text Input)
```tsx
import { FormField } from './components/Form';

<FormField
  name="email"
  label="Email"
  type="email"
  value={value}
  onChange={handleChange}
  error={errors.email}
  helperText="We'll never share your email"
  required
/>
```

#### SelectField
```tsx
import { SelectField } from './components/Form';

<SelectField
  name="gender"
  label="Geschlecht"
  value={value}
  onChange={handleChange}
  options={[
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ]}
  error={errors.gender}
  required
/>
```

#### CheckboxField
```tsx
import { CheckboxField } from './components/Form';

<CheckboxField
  name="agree"
  label="I agree to the terms"
  checked={value}
  onChange={handleChange}
  error={errors.agree}
/>
```

#### TextAreaField
```tsx
import { TextAreaField } from './components/Form';

<TextAreaField
  name="message"
  label="Your message"
  value={value}
  onChange={handleChange}
  rows={5}
  error={errors.message}
  required
/>
```

### ReviewForm Component

The main form component that orchestrates a 5-page review entry flow:

**Page 1:** Personal Info
- Name, gender, age, year of hiring

**Page 2:** Job Information  
- Position, duration, languages, company size, hours/week, and special conditions

**Page 3:** Experience Overview
- Main experience text, tone, explanation clarity, being listened to

**Page 4:** Safety & Respect
- Boundary respect, ability to ask questions, identity respect, appreciation, proximity, needs

**Page 5:** Additional Info & Publication
- Appreciation details, feedback, wishes, sharing comfort, publication consent

#### Usage

```tsx
import { ReviewForm, ReviewFormData } from './components/ReviewForm';

function MyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      // Make your API call here (company ID should be passed separately)
      await api.createReview(formData, companyId);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReviewForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitError={error}
      // For editing: pass initial data
      // initialData={{
      //   name: 'John',
      //   gender: 'cis_male',
      //   ...
      // }}
    />
  );
}
```

#### Props

```tsx
interface ReviewFormProps {
  initialData?: Partial<ReviewFormData>;        // Pre-fill form for editing
  onSubmit: (data: ReviewFormData) => Promise<void>; // Called when "Abschicken" is clicked
  isSubmitting?: boolean;                       // Disable submit button while loading
  submitError?: string;                         // Show error message at bottom
}
```

#### ReviewFormData Type

```tsx
interface ReviewFormData {
  name: string;
  email: string;
  publishName: boolean;
  gender: string;
  ageAtEmployment: string;
  genderOuted: boolean;
  position: string;
  duration: string;
  yearOfHiring: string;
  listenedTo: boolean;
  tone: string;
  explained: string;
  canAskColleagues: boolean;
  canAskBoss: boolean;
  proximity: string;
  boundariesRespected: boolean;
  appreciated: string;
  experienceText: string;
  languages: string;
  size: string;
  collective: boolean;
  hoursPerWeek: string;
  trainingShortenable: boolean;
  partTime: boolean;
  sharedWithCompany: string;
  feltComfortableSharing: string;
  needsRespected: string;
  feedback: string;
  moreWishes: string;
  status: string;
}
```

### useReviewSubmit Hook

A reusable hook for handling form submission with success/error callbacks:

```tsx
import { useReviewSubmit } from './hooks/useReviewSubmit';

function MyComponent() {
  const { isSubmitting, error, submit } = useReviewSubmit({
    onSuccess: () => {
      console.log('Success!');
      navigate('/success');
    },
    onError: (err) => {
      console.error('Failed:', err);
    },
  });

  return (
    <ReviewForm
      onSubmit={submit}
      isSubmitting={isSubmitting}
      submitError={error || undefined}
    />
  );
}
```

## Styling

All components use Tailwind CSS with a consistent color scheme:
- **Primary color**: `navbar-blue` (defined in your Tailwind config)
- **Focus states**: `focus:ring-2 focus:ring-navbar-blue`
- **Error color**: `red-600`
- **Background**: `gray-50` for page, `white` for container

To customize styling globally, update these components or modify your Tailwind configuration.

## Mobile Optimization

- Multi-page form prevents overwhelming on mobile devices
- Progress indicator shows page number and percentage
- Buttons stack nicely on smaller screens
- Form uses `max-w-2xl` container for optimal readability
- Automatic scroll to top when navigating between pages

## Integration with GraphQL

See `src/examples/ReviewFormExample.tsx` for a complete example of:
- Fetching companies with `useQuery`
- Creating reviews with `useMutation`
- Updating reviews with `useMutation`
- Using the form with Apollo Client

## Validation

- Field-level validation on page navigation
- Required fields prevent moving to next page
- Clear error messages displayed inline
- Errors clear when user starts typing
