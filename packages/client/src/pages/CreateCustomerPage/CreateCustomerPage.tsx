import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/obra/Button';
import { Input } from '@/components/obra/Input';

type ValidationErrors = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
};

export function CreateCustomerPage() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const createCustomer = trpc.customer.create.useMutation({
    onSuccess: (data) => {
      utils.customer.list.invalidate();
      navigate(`/customers/${data.id}`);
    },
    onError: (error) => {
      alert(`Failed to create customer: ${error.message}`);
    },
  });

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
    validateForm();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setTouched(new Set(['firstName', 'lastName', 'username', 'email']));

    if (!validateForm()) {
      return;
    }

    createCustomer.mutate({
      firstName,
      lastName,
      username,
      email,
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6 h-full flex-1 overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Customer</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name *
          </label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (touched.has('firstName')) validateForm();
            }}
            onBlur={() => handleBlur('firstName')}
            placeholder="Enter first name"
            className={touched.has('firstName') && validationErrors.firstName ? 'border-red-500' : ''}
          />
          {touched.has('firstName') && validationErrors.firstName && (
            <p className="text-sm text-red-600">{validationErrors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name *
          </label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (touched.has('lastName')) validateForm();
            }}
            onBlur={() => handleBlur('lastName')}
            placeholder="Enter last name"
            className={touched.has('lastName') && validationErrors.lastName ? 'border-red-500' : ''}
          />
          {touched.has('lastName') && validationErrors.lastName && (
            <p className="text-sm text-red-600">{validationErrors.lastName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username *
          </label>
          <Input
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (touched.has('username')) validateForm();
            }}
            onBlur={() => handleBlur('username')}
            placeholder="Enter username"
            className={touched.has('username') && validationErrors.username ? 'border-red-500' : ''}
          />
          {touched.has('username') && validationErrors.username && (
            <p className="text-sm text-red-600">{validationErrors.username}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address *
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched.has('email')) validateForm();
            }}
            onBlur={() => handleBlur('email')}
            placeholder="Enter email address"
            className={touched.has('email') && validationErrors.email ? 'border-red-500' : ''}
          />
          {touched.has('email') && validationErrors.email && (
            <p className="text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={createCustomer.isPending}
            className="bg-[#00848b] hover:bg-[#006d73] text-white"
          >
            {createCustomer.isPending ? 'Creating...' : 'Create Customer'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/customers')}
            disabled={createCustomer.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
