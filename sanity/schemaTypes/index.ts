import { type SchemaTypeDefinition } from 'sanity';
import {author} from "@/sanity/schemaTypes/author";
import {startup} from '@/sanity/schemaTypes/Startup';
import { viewEvent } from "@/sanity/schemaTypes/viewEvent";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, startup, viewEvent],
}
