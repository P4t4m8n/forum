/**
 * Represents a small quote entity.
 *
 * @interface IQuoteSmall
 * @extends {IEntity}
 *
 * @property {string} content - The content of the quote.
 * @property {ICharacterSmall} fromCharacter - The character who said the quote.
 * @property {ICharacterSmall} [toCharacter] - The character to whom the quote is addressed (optional).
 */
declare interface IQuoteSmall extends IEntity {
  content: string;
  fromCharacter: ICharacterSmall;
  toCharacter?: ICharacterSmall;
}
/**
 * Represents a quote entity.
 *
 * @interface IQuote
 * @extends {IQuoteSmall}
 *
 * @property {ICharacter} fromCharacter - The character who said the quote.
 * @property {ICharacter} [toCharacter] - The character to whom the quote is addressed (optional).
 */
declare interface IQuote extends IQuoteSmall {
  fromCharacter: ICharacterSmall;
  toCharacter?: ICharacterSmall;
}
/**
 * Represents a quote data transfer object.
 *
 * @interface IQuoteDto
 * @extends {IEntity}
 *
 * @property {string} content - The content of the quote.
 * @property {string} fromCharacterId - The ID of the character who said the quote.
 * @property {string | null} [toCharacterId] - The ID of the character to whom the quote is addressed (optional).
 */
declare interface IQuoteDto extends IEntity {
  content: string;
  fromCharacterId: string;
  toCharacterId?: string;
}
