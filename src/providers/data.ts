import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

import { CreateResponse, GetOneResponse, ListResponse } from "@/types";
import { BACKEND_BASE_URL } from "@/constants";

const shouldRedirectToErrorPage = (status: number): boolean => {
  // Only redirect on critical errors (5xx, 404, 403)
  // Allow 400, 401, 429 to be handled by the UI normally
  return status >= 500 || status === 404 || status === 403;
};

const handleApiError = async (response: Response) => {
  if (!response.ok) {
    // Handle 429 (Rate Limit) errors specially - store for toaster
    if (response.status === 429) {
      let retryAfter = 60; // Default 60 seconds
      let message = "Too many requests. Please wait.";

      try {
        const json = await response.json();
        retryAfter = json.retryAfter || json.retry_after || retryAfter;
        message = json.message || message;
      } catch (e) {
        // If response is not JSON, check headers
        const retryAfterHeader = response.headers.get("Retry-After");
        if (retryAfterHeader) {
          retryAfter = parseInt(retryAfterHeader, 10);
        }
      }

      const rateLimitError = {
        status: 429,
        message,
        retryAfter,
        timestamp: Date.now(),
      };

      sessionStorage.setItem("rateLimitError", JSON.stringify(rateLimitError));
      throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
    }

    // Handle other critical errors with redirect
    if (shouldRedirectToErrorPage(response.status)) {
      const errorData = {
        status: response.status,
        message: response.statusText,
        data: null,
      };

      try {
        const json = await response.json();
        errorData.data = json;
      } catch (e) {
        // If response is not JSON, keep the status text
      }

      sessionStorage.setItem("errorData", JSON.stringify(errorData));
      window.location.href = "/error";
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
};

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters }) => {
      const params: Record<string, string | number> = {};

      if (pagination?.mode !== "off") {
        const page = pagination?.currentPage ?? 1;
        const pageSize = pagination?.pageSize ?? 10;

        params.page = page;
        params.limit = pageSize;
      }

      filters?.forEach((filter) => {
        const field = "field" in filter ? filter.field : "";
        const value = String(filter.value);

        if (field === "role") {
          params.role = value;
        }

        if (resource === "departments") {
          if (field === "name" || field === "code") params.search = value;
        }

        if (resource === "users") {
          if (field === "search" || field === "name" || field === "email") {
            params.search = value;
          }
        }

        if (resource === "subjects") {
          if (field === "department") params.department = value;
          if (field === "name" || field === "code") params.search = value;
        }

        if (resource === "classes") {
          if (field === "name") params.search = value;
          if (field === "subject") params.subject = value;
          if (field === "teacher") params.teacher = value;
        }
      });

      return params;
    },

    mapResponse: async (response) => {
      await handleApiError(response);
      const payload: ListResponse = await response.json();
      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      await handleApiError(response);
      const payload: ListResponse = await response.json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

  create: {
    getEndpoint: ({ resource }) => resource,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      await handleApiError(response);
      const json: CreateResponse = await response.json();
      return json.data ?? {};
    },
  },

  getOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    mapResponse: async (response) => {
      await handleApiError(response);
      const json: GetOneResponse = await response.json();
      return json.data ?? {};
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };
