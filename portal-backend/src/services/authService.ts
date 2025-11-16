import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { config } from "../config/env.js";
import { suitecrmRequest } from "./suitecrmClient.js";
import { PortalUser } from "../types/portal.js";

type ContactAttributes = {
  id: string;
  name: string;
  email1?: string | null;
  stic_pa_username_c?: string | null;
  stic_pa_password_c?: string | null;
};

type ContactRecord = {
  id: string;
  type: string;
  attributes: ContactAttributes & Record<string, unknown>;
};

type ContactFilterResponse = {
  data: ContactRecord[];
};

const CONTACT_FIELDS = [
  "first_name",
  "last_name",
  "email1",
  "stic_pa_username_c",
  "stic_pa_password_c"
];

const buildContactName = (attributes: Record<string, unknown>): string => {
  const firstName = (attributes["first_name"] as string) || "";
  const lastName = (attributes["last_name"] as string) || "";
  const name = `${firstName} ${lastName}`.trim();
  return name || (attributes["name"] as string) || "Portal User";
};

export const authenticatePortalUser = async (
  username: string,
  password: string
): Promise<{ token: string; contact: PortalUser }> => {
  if (!username || !password) {
    throw createHttpError(400, "Username and password are required");
  }

  const payload = {
    filter: [
      {
        stic_pa_username_c: {
          $equals: username
        }
      }
    ],
    fields: CONTACT_FIELDS,
    max_num: 2,
    offset: 0
  };

  const response = await suitecrmRequest<ContactFilterResponse>({
    method: "POST",
    url: "/Api/V8/module/Contacts/filter",
    data: payload
  });

  if (!response.data.length) {
    throw createHttpError(401, "Invalid username or password");
  }

  if (response.data.length > 1) {
    throw createHttpError(401, "Multiple contacts found for username");
  }

  const contact = response.data[0];
  const attributes = contact.attributes;
  const storedPassword = attributes["stic_pa_password_c"] as string | undefined;

  if (!storedPassword || storedPassword !== password) {
    throw createHttpError(401, "Invalid username or password");
  }

  const portalUser: PortalUser = {
    contact_id: contact.id,
    contact_name: buildContactName(attributes),
    contact_email: (attributes["email1"] as string) || undefined,
    username
  };

  const token = jwt.sign(portalUser, config.portal.jwtSecret, {
    expiresIn: "8h"
  });

  return { token, contact: portalUser };
};

export const verifyToken = (token: string): PortalUser => {
  try {
    const decoded = jwt.verify(token, config.portal.jwtSecret) as PortalUser;
    return decoded;
  } catch (error) {
    throw createHttpError(401, "Invalid or expired token");
  }
};
