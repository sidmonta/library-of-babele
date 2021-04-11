import { Quad, Quad_Subject, Quad_Predicate, Quad_Object } from 'n3';
declare type URI = string;
/**
 * Questa classe è una rappresentazione delle Annotazioni RDF.
 * È costruita per essere utilizzata come un qualsiasi tipo di
 *
 * Nell query SPARQL oppure nella stampa generano un la stringa di testo che
 * identifica una annotazione nel formalismo N-Triple
 * @example
 * // Example of result:
 * [ rdf:type owl:Axiom ;
 *  owl:annotatedSource pizza:Italy ;
 *  owl:annotatedProperty <https://schema.org/prova> ;
 *  owl:annotatedTarget "Prova" ;
 *  rdfs:isDefinedBy "Luca"
 * ] .
 */
export default class RDFAnnotation {
    annotatedSource: Quad_Subject;
    annotatedProperty: Quad_Predicate;
    annotatedTarget: Quad_Object;
    annotationPredicate: URI;
    annotationObject: string;
    termType: string;
    constructor(quad: Quad, annotation: string, annotationPredicate?: URI);
    get value(): string;
    equals(other: RDFAnnotation): boolean;
    toJSON(): {
        termType: string;
        value: string;
    };
}
export {};
