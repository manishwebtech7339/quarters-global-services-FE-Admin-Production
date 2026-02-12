import { z } from 'zod';
import { emptySchema, defaultMasterChecklistSchema } from './common';
// USA Visa
import * as usaVisa from './usa/visa';
// USA Passport
import * as usaPassport from './usa/passport';
// USA Immigration Service
import * as usaImmigrationService from './usa/immigrationService';
// UK Passport
import * as ukPassport from './uk/passport';
// India Visa
import * as indiaVisa from './india/visa';
// India Passport
import * as indiaPassport from './india/passport';
// Consular
import * as indiaConsular from './india/consular';
// ICP
import * as indiaIcp from './india/icp';
// Pan Card
import * as indiaPanCard from './india/panCard';
// OCI
import * as indiaOci from './india/oci';
// China E-Visa
import * as chinaEVsa from './china/evisa';
// Other countries
import * as otherVisa from './other/visa';
import * as otherPassport from './other/passport';
// E-Visa
import * as eVisa from './other/evisa';
// POA
import * as poa from './other/poa';

import { extractSchemas } from '.';

// ----------------------------------------
// Build registry keyed by serviceType
// ----------------------------------------
export const schemaRegistry = new Map<string, z.ZodObject<any>>();

[
  emptySchema,
  defaultMasterChecklistSchema,
  ...extractSchemas(usaVisa),
  ...extractSchemas(usaPassport),
  ...extractSchemas(usaImmigrationService),
  ...extractSchemas(ukPassport),
  ...extractSchemas(indiaVisa),
  ...extractSchemas(indiaPassport),
  ...extractSchemas(indiaConsular),
  ...extractSchemas(indiaIcp),
  ...extractSchemas(indiaPanCard),
  ...extractSchemas(indiaOci),
  ...extractSchemas(chinaEVsa),
  ...extractSchemas(otherVisa),
  ...extractSchemas(otherPassport),
  ...extractSchemas(eVisa),
  ...extractSchemas(poa),
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
