'use client';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { PhoneInput2 } from '@/components/ui/PhoneInput2';

export default function PersonalInfo({
  isView = false,
  isEdit = false,
}: {
  isView?: boolean;
  isEdit?: boolean;
}) {
  const form = useFormContext();
  return (
    <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
      <p className="col-span-2 font-semibold">Personal Information</p>

      {/* First / Last / Middle */}
      <FormField
        name="firstName"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="lastName"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="middleName"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Middle Name</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="previousNames"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Previous Legal Name(s)</FormLabel>
            <FormControl>
              <Input placeholder="maiden / other" readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="email"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" readOnly={isView} disabled={!!isEdit} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Sex */}
      <FormField
        name="sex"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value ?? ''}
                onValueChange={field.onChange}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Male" id="sex-m" disabled={isView} />
                  <label htmlFor="sex-m">Male</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Female" id="sex-f" disabled={isView} />
                  <label htmlFor="sex-f">Female</label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* DOB */}
      <FormField
        name="dob"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <Input
                type="date"
                readOnly={isView}
                max={format(new Date(), 'yyyy-MM-dd')}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Place of Birth */}
      <FormField
        name="birthCity"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Place of Birth — City</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="birthState"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Place of Birth — State/Province</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Country of Birth + optional specify */}
      <FormField
        name="countryOfBirth"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country of Birth</FormLabel>
            <FormControl>
              <Select value={field.value ?? ''} onValueChange={field.onChange} disabled={isView}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="countryOfBirthOther"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specify Country of Birth (if Other)</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="nationalId"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>National ID (Non-US citizens only)</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="religion"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Religion</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="visibleMarks"
        control={form.control}
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Visible Identification Marks (scars, tattoos)</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Education */}
      <FormField
        name="educationLevel"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Highest Education</FormLabel>
            <FormControl>
              <Select value={field.value ?? ''} onValueChange={field.onChange} disabled={isView}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High School Diploma">High School Diploma</SelectItem>
                  <SelectItem value="Some HS (did not complete 10th)">
                    Some HS (did not complete 10th)
                  </SelectItem>
                  <SelectItem value="Some HS (completed 10th)">Some HS (completed 10th)</SelectItem>
                  <SelectItem value="Bachelors’ Degree">Bachelors’ Degree</SelectItem>
                  <SelectItem value="Masters/Doctorate">Masters’/Doctorate</SelectItem>
                  <SelectItem value="Professional Degree">Professional Degree</SelectItem>
                  <SelectItem value="Child younger than HS age">
                    Child younger than HS age
                  </SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="educationOther"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>If Other, specify</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Citizenship */}
      <FormField
        name="citizenshipCountry"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country of Citizenship</FormLabel>
            <FormControl>
              <Select value={field.value ?? ''} onValueChange={field.onChange} disabled={isView}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="citizenshipCountryOther"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specify Citizenship Country (if Other)</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="citizenshipAcquiredBy"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Citizenship Acquired By</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value ?? ''}
                onValueChange={field.onChange}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Birth" id="cab-b" disabled={isView} />
                  <label htmlFor="cab-b">Birth</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Naturalization" id="cab-n" disabled={isView} />
                  <label htmlFor="cab-n">Naturalization</label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="previousCitizenship"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Previous Citizenship</FormLabel>
            <FormControl>
              <Select value={field.value ?? ''} onValueChange={field.onChange} disabled={isView}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="previousCitizenshipOther"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specify Previous Citizenship (if Other)</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Information */}
      <FormField
        name="address"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="city"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="state"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>State</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="pincode"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pincode</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="country"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input readOnly={isView} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="phone"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <PhoneInput2
                disabled={isView}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val ? `+${val}` : '');
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
