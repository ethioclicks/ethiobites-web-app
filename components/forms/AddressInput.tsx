import { UserAddress } from '@/types/user';
import Input from '@/components/ui/Input';

interface AddressInputProps {
  value: UserAddress;
  onChange: (address: UserAddress) => void;
  errors?: {
    street?: string;
    city?: string;
  };
  disabled?: boolean;
}

const ethiopianCities = [
  'Addis Ababa',
  'Dire Dawa',
  'Mekelle',
  'Gondar',
  'Adama (Nazret)',
  'Hawassa',
  'Bahir Dar',
  'Dessie',
  'Jimma',
  'Jijiga',
  'Shashamane',
  'Bishoftu',
  'Sodo',
  'Arba Minch',
  'Hosaena',
  'Harar',
  'Dilla',
  'Nekemte',
  'Debre Birhan',
  'Asella',
  'Other',
];

export default function AddressInput({ 
  value, 
  onChange, 
  errors = {}, 
  disabled = false 
}: AddressInputProps) {
  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      street: e.target.value,
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    onChange({
      ...value,
      city: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-text-primary mb-2">
        Address <span className="text-red-500">*</span>
      </div>
      
      {/* Street Address */}
      <Input
        label="Street Address"
        placeholder="Enter your street address"
        value={value.street}
        onChange={handleStreetChange}
        error={errors.street}
        disabled={disabled}
        required
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      />

      {/* City Selection */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-text-primary">
          City <span className="text-red-500">*</span>
        </label>
        
        <div className="relative">
          <select
            value={value.city}
            onChange={handleCityChange}
            disabled={disabled}
            className={`
              w-full px-4 py-3 pl-12 border rounded-lg transition-colors duration-200 
              focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500
              bg-white border-gray-300 text-text-primary
              ${errors.city ? 'border-red-300 focus:border-red-500 focus:ring-red-300' : ''}
              ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
            `}
            required
          >
            <option value="">Select your city</option>
            {ethiopianCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          
          {/* Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>

        {/* City Input for "Other" selection */}
        {value.city === 'Other' && (
          <Input
            placeholder="Enter your city name"
            value=""
            onChange={handleCityChange}
            disabled={disabled}
            className="mt-2"
          />
        )}
        
        {errors.city && (
          <p className="text-sm text-red-500">{errors.city}</p>
        )}
      </div>
    </div>
  );
}