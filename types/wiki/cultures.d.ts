/**
 * Represents a small culture entity.
 *
 * @interface ICultureSmall
 * @extends {IEntity}
 *
 * @property {string} name - The name of the culture.
 * @property {(string | null | undefined)} [imgUrl] - The URL of the image representing the culture. This property is optional.
 */
declare interface ICultureSmall extends IEntity {
  name: string;
  imgUrl?: string | null;
}
/**
 * Represents a culture entity.
 *
 * @interface ICulture
 * @extends {ICultureSmall}
 *
 * @property {ICharacterSmall[]} characters - The characters belonging to the culture.
 */
declare interface ICulture extends ICultureSmall {
  characters: ICharacterSmall[];
}
/**
 * Represents a culture data transfer object.
 *
 * @interface ICultureDTO
 * @extends {ICultureSmall}
 *
 * @property {string[]} characterIds - The IDs of the characters belonging to the culture.
 */
declare interface ICultureDTO extends ICultureSmall {
  characterIds?: string[];
}
