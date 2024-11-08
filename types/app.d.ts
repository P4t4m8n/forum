declare interface Field {
  name: string;
  type: string;
  label?: React.ReactNode;
  options?: { value: string; display?: React.ReactNode }[];
  placeholder?: string;
  defaultValue: string | boolean | string[] | boolean[] | number;
  hidden?: boolean;
}

declare interface IEntity {
  id?: string;
}

declare type TServiceConfig<T, DTO> = {
  tableName: string;
  toDTO: (data: T) => DTO;
  getEmpty: () => T;
};
