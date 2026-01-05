import { z } from 'zod';

// USA Visa
import * as usaVisa from './usa/visa';
// USA Passport
import * as usaPassport from './usa/passport';
// India Visa
import * as indiaVisa from './india/visa';
// India E-Visa
import * as indiaEVisa from './india/evisa';
// India Passport
import * as indiaPassport from './india/passport';
// OCI
import * as indiaOci from './india/oci';
// Consular
import * as indiaConsular from './india/consular';
// ICP
import * as indiaIcp from './india/icp';
// China E-Visa
import * as chinaEVsa from './china/evisa';
// Other countries
import * as otherVisa from './other/visa';
import { extractSchemas } from '.';

// ----------------------------------------
// Build registry keyed by serviceType
// ----------------------------------------
export const schemaRegistry = new Map<string, z.ZodObject<any>>();

[
  ...extractSchemas(usaVisa),
  ...extractSchemas(usaPassport),
  ...extractSchemas(indiaVisa),
  ...extractSchemas(indiaEVisa),
  ...extractSchemas(indiaPassport),
  ...extractSchemas(indiaOci),
  ...extractSchemas(indiaConsular),
  ...extractSchemas(indiaIcp),
  ...extractSchemas(chinaEVsa),
  ...extractSchemas(otherVisa),
].forEach((schema) => {
  const serviceType = getServiceType(schema);

  if (serviceType) {
    schemaRegistry.set(serviceType, schema);
  }
});

function getServiceType(schema: z.ZodObject<any>): string | undefined {
  const field = schema.shape?.serviceType;
  if (!field) return undefined;

  const def = (field as any)._def;

  return (
    def.value ??
    (Array.isArray(def.values) ? def.values[0] : undefined) ??
    (!Array.isArray(def.values) ? Object.values(def.values ?? {})[0] : undefined)
  );
}
