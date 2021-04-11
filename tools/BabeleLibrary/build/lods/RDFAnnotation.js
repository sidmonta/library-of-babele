"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("n3");
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
class RDFAnnotation {
    constructor(quad, annotation, annotationPredicate = 'http://www.w3.org/2000/01/rdf-schema#isDefinedBy') {
        this.annotationPredicate = '';
        this.annotationObject = '';
        this.termType = 'annotation';
        this.annotatedSource = quad.subject;
        this.annotatedProperty = quad.predicate;
        this.annotatedTarget = quad.object;
        this.annotationPredicate = annotationPredicate;
        this.annotationObject = annotation;
    }
    get value() {
        return `[
      rdf:type owl:Axiom ;
      owl:annotatedSource <${this.annotatedSource.value}> ;
      owl:annotatedProperty <${this.annotatedProperty.value}> ;
      owl:annotatedTarget <${this.annotatedTarget.value}> ;
      <${this.annotationPredicate}> "${this.annotationObject}"
    ].`;
    }
    equals(other) {
        return this.value === other.value;
    }
    toJSON() {
        return {
            termType: this.termType,
            value: this.value
        };
    }
}
exports.default = RDFAnnotation;
