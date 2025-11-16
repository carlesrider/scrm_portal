export type PortalModuleConfig = {
  label: string;
  listFields: string[];
  detailFields: string[];
  editableFields: string[];
  defaultFilter?: Record<string, unknown>;
  searchFields?: string[];
};

export type PortalConfig = {
  modules: Record<string, PortalModuleConfig>;
};

export const portalConfig: PortalConfig = {
  modules: {
    Cases: {
      label: "Incidències",
      listFields: ["case_number", "name", "status", "priority", "date_entered"],
      detailFields: [
        "case_number",
        "name",
        "status",
        "priority",
        "description",
        "account_name",
        "date_entered",
        "date_modified"
      ],
      editableFields: ["status", "priority", "description"],
      defaultFilter: {
        status: {
          $not_equals: "Closed"
        }
      },
      searchFields: ["case_number", "name"]
    },
    Contacts: {
      label: "Contactes",
      listFields: ["first_name", "last_name", "phone_work", "email1"],
      detailFields: [
        "first_name",
        "last_name",
        "phone_work",
        "phone_mobile",
        "email1",
        "primary_address_street",
        "primary_address_city"
      ],
      editableFields: [
        "phone_work",
        "phone_mobile",
        "primary_address_street",
        "primary_address_city"
      ],
      searchFields: ["first_name", "last_name", "email1"]
    }
  }
};
