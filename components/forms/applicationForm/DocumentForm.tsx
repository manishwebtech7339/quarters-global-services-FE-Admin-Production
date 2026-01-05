import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CreateApplicationType, getSchemaFields } from './schemas/index';
import { FileInput } from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { schemaRegistry } from './schemas/schema-registry';
import { useEffect } from 'react';

interface DocumentFormProps {
  isView?: boolean;
  selectedService?: 'visa' | string;
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void;
  existingDocuments?: any;
}

function formatLabel(fieldName: string) {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

const DocumentForm = ({
  selectedService,
  selectedCategory,
  setSelectedCategory,
  existingDocuments,
  isView,
}: DocumentFormProps) => {
  const form = useFormContext<CreateApplicationType>();

  const hasService = selectedCategory && schemaRegistry.has(selectedCategory);
  const schema = hasService ? schemaRegistry.get(selectedCategory)! : null;

  const fields = schema ? getSchemaFields(schema) : [];

  // Automatically set category to "visa-global" if service is visa and no category is selected
  useEffect(() => {
    if (selectedService === 'visa' && selectedCategory && !hasService) {
      setSelectedCategory && setSelectedCategory('visa-global');
      form.setValue('documents.serviceType', 'visa-global');
    }
  }, [selectedCategory]);

  if (selectedCategory && !fields.length) {
    return null;
  }
  return (
    <>
      {fields.length > 0 ? (
        <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
          <p className="text-base font-semibold text-primary">
            {selectedCategory?.replace(/-/g, ' ').toUpperCase()}
          </p>

          <p className="col-span-2 font-semibold">Documents</p>

          {fields.map((f) => {
            if (f.name === 'serviceType') return null;

            if (f.type === 'text') {
              return (
                <FormField
                  key={f.name}
                  name={`documents.${f.name}` as any}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {formatLabel(f.name)}
                        {f.required && <span className="text-red-500 ml-1">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isView} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }

            if (f.type === 'file') {
              return (
                <FormField
                  key={f.name}
                  name={`documents.${f.name}` as any}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {formatLabel(f.name)}
                        {f.required && <span className="text-red-500 ml-1">*</span>}
                      </FormLabel>
                      <FormControl>
                        <FileInput
                          ref={field.ref}
                          onFileChange={field.onChange}
                          selectedFileValue={field.value instanceof File ? field.value : null}
                          existingFileUrl={
                            typeof existingDocuments?.[f.name] === 'object'
                              ? existingDocuments?.[f.name]?.file || ''
                              : existingDocuments?.[f.name] || ''
                          }
                          existingFileName={
                            field.value instanceof File ? field.value.name : `${f.name}.pdf`
                          }
                          disabled={isView}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }

            return null;
          })}
        </div>
      ) : (
        <div className="p-4 border rounded-lg">
          <p className="text-center text-gray-500">
            Please select service category to view required documents.
          </p>
        </div>
      )}
    </>
  );
};

export default DocumentForm;
