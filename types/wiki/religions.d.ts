/**
 * Represents a small religion entity.
 *
 * @interface IReligionSmall
 * @extends {IEntity}
 *
 * @property {string} name - The name of the religion.
 * @property {(string | null | undefined)} [imgUrl] - The URL of the image representing the religion. This property is optional.
 */
declare interface IReligionSmall extends IEntity {
  name: string;
  imgUrl?: string | null;
}
/**
 * Represents a religion entity.
 *
 * @interface IReligion
 * @extends {IReligionSmall}
 *
 * @property {ICharacterSmall[]} characters - The characters who follow the religion.
 */
declare interface IReligion extends IReligionSmall {
  characters: ICharacterSmall[];
}
/**
 * Represents a religion data transfer object.
 *
 * @interface IReligionDto
 * @extends {IReligionSmall}
 *
 * @property {string[]} characterIds - The IDs of the characters who follow the religion.
 */
declare interface IReligionDto extends IReligionSmall {
  characterIds?: string[];
}
