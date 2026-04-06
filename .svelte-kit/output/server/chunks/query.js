import { get_request_store, with_request_store } from "@sveltejs/kit/internal/server";
import { s as stringify_remote_arg, c as create_remote_key, u as unfriendly_hydratable, a as stringify, h as handle_error_and_jsonify } from "./shared.js";
import { p as prerendering } from "./environment.js";
import { parse } from "devalue";
import { error } from "@sveltejs/kit";
import { HttpError, SvelteKitError } from "@sveltejs/kit/internal";
function create_validator(validate_or_fn, maybe_fn) {
  if (!maybe_fn) {
    return (arg) => {
      if (arg !== void 0) {
        error(400, "Bad Request");
      }
    };
  }
  if (validate_or_fn === "unchecked") {
    return (arg) => arg;
  }
  if ("~standard" in validate_or_fn) {
    return async (arg) => {
      const { event, state } = get_request_store();
      const result = await validate_or_fn["~standard"].validate(arg);
      if (result.issues) {
        error(
          400,
          await state.handleValidationError({
            issues: result.issues,
            event
          })
        );
      }
      return result.value;
    };
  }
  throw new Error(
    'Invalid validator passed to remote function. Expected "unchecked" or a Standard Schema (https://standardschema.dev)'
  );
}
async function get_response(internals, arg, state, get_result) {
  await 0;
  const cache = get_cache(internals, state);
  const key = stringify_remote_arg(arg, state.transport);
  const entry = cache[key] ??= {
    serialize: false,
    data: get_result()
  };
  entry.serialize ||= !!state.is_in_universal_load;
  if (state.is_in_render && internals.id) {
    const remote_key = create_remote_key(internals.id, key);
    Promise.resolve(entry.data).then((value) => {
      void unfriendly_hydratable(remote_key, () => stringify(value, state.transport));
    }).catch(() => {
    });
  }
  return entry.data;
}
function parse_remote_response(data, transport) {
  const revivers = {};
  for (const key in transport) {
    revivers[key] = transport[key].decode;
  }
  return parse(data, revivers);
}
async function run_remote_function(event, state, allow_cookies, get_input, fn) {
  const store = {
    event: {
      ...event,
      setHeaders: () => {
        throw new Error("setHeaders is not allowed in remote functions");
      },
      cookies: {
        ...event.cookies,
        set: (name, value, opts) => {
          if (!allow_cookies) {
            throw new Error("Cannot set cookies in `query` or `prerender` functions");
          }
          if (opts.path && !opts.path.startsWith("/")) {
            throw new Error("Cookies set in remote functions must have an absolute path");
          }
          return event.cookies.set(name, value, opts);
        },
        delete: (name, opts) => {
          if (!allow_cookies) {
            throw new Error("Cannot delete cookies in `query` or `prerender` functions");
          }
          if (opts.path && !opts.path.startsWith("/")) {
            throw new Error("Cookies deleted in remote functions must have an absolute path");
          }
          return event.cookies.delete(name, opts);
        }
      }
    },
    state: {
      ...state,
      is_in_remote_function: true
    }
  };
  const input = await with_request_store(store, get_input);
  return with_request_store(store, () => fn(input));
}
function get_cache(internals, state = get_request_store().state) {
  let cache = state.remote.data?.get(internals);
  if (cache === void 0) {
    cache = {};
    (state.remote.data ??= /* @__PURE__ */ new Map()).set(internals, cache);
  }
  return cache;
}
// @__NO_SIDE_EFFECTS__
function query(validate_or_fn, maybe_fn) {
  const fn = maybe_fn ?? validate_or_fn;
  const validate = create_validator(validate_or_fn, maybe_fn);
  const __ = { type: "query", id: "", name: "", validate };
  const wrapper = (arg) => {
    if (prerendering) {
      throw new Error(
        `Cannot call query '${__.name}' while prerendering, as prerendered pages need static data. Use 'prerender' from $app/server instead`
      );
    }
    const { event, state } = get_request_store();
    const is_validated = is_validated_argument(__, state, arg);
    return create_query_resource(
      __,
      arg,
      state,
      () => run_remote_function(event, state, false, () => is_validated ? arg : validate(arg), fn)
    );
  };
  Object.defineProperty(wrapper, "__", { value: __ });
  return wrapper;
}
function is_validated_argument(__, state, arg) {
  return state.remote.validated?.get(__.id)?.has(arg) ?? false;
}
function mark_argument_validated(__, state, arg) {
  const validated = state.remote.validated ??= /* @__PURE__ */ new Map();
  let validated_args = validated.get(__.id);
  if (!validated_args) {
    validated_args = /* @__PURE__ */ new Set();
    validated.set(__.id, validated_args);
  }
  validated_args.add(arg);
  return arg;
}
// @__NO_SIDE_EFFECTS__
function batch(validate_or_fn, maybe_fn) {
  const fn = maybe_fn ?? validate_or_fn;
  const validate = create_validator(validate_or_fn, maybe_fn);
  const __ = {
    type: "query_batch",
    id: "",
    name: "",
    run: async (args, options) => {
      const { event, state } = get_request_store();
      return run_remote_function(
        event,
        state,
        false,
        async () => Promise.all(args.map(validate)),
        async (input) => {
          const get_result = await fn(input);
          return Promise.all(
            input.map(async (arg, i) => {
              try {
                const data = get_result(arg, i);
                return { type: "result", data: stringify(data, state.transport) };
              } catch (error2) {
                return {
                  type: "error",
                  error: await handle_error_and_jsonify(event, state, options, error2),
                  status: error2 instanceof HttpError || error2 instanceof SvelteKitError ? error2.status : 500
                };
              }
            })
          );
        }
      );
    }
  };
  let batching = /* @__PURE__ */ new Map();
  const wrapper = (arg) => {
    if (prerendering) {
      throw new Error(
        `Cannot call query.batch '${__.name}' while prerendering, as prerendered pages need static data. Use 'prerender' from $app/server instead`
      );
    }
    const { event, state } = get_request_store();
    return create_query_resource(__, arg, state, () => {
      return new Promise((resolve, reject) => {
        const key = stringify_remote_arg(arg, state.transport);
        const entry = batching.get(key);
        if (entry) {
          entry.resolvers.push({ resolve, reject });
          return;
        }
        batching.set(key, {
          arg,
          resolvers: [{ resolve, reject }]
        });
        if (batching.size > 1) return;
        setTimeout(async () => {
          const batched = batching;
          batching = /* @__PURE__ */ new Map();
          const entries = Array.from(batched.values());
          const args = entries.map((entry2) => entry2.arg);
          try {
            return await run_remote_function(
              event,
              state,
              false,
              async () => Promise.all(args.map(validate)),
              async (input) => {
                const get_result = await fn(input);
                for (let i = 0; i < entries.length; i++) {
                  try {
                    const result = get_result(input[i], i);
                    for (const resolver of entries[i].resolvers) {
                      resolver.resolve(result);
                    }
                  } catch (error2) {
                    for (const resolver of entries[i].resolvers) {
                      resolver.reject(error2);
                    }
                  }
                }
              }
            );
          } catch (error2) {
            for (const entry2 of batched.values()) {
              for (const resolver of entry2.resolvers) {
                resolver.reject(error2);
              }
            }
          }
        }, 0);
      });
    });
  };
  Object.defineProperty(wrapper, "__", { value: __ });
  return wrapper;
}
function create_query_resource(__, arg, state, fn) {
  let promise = null;
  const get_promise = () => {
    return promise ??= get_response(__, arg, state, fn);
  };
  return {
    /** @type {Promise<any>['catch']} */
    catch(onrejected) {
      return get_promise().catch(onrejected);
    },
    current: void 0,
    error: void 0,
    /** @type {Promise<any>['finally']} */
    finally(onfinally) {
      return get_promise().finally(onfinally);
    },
    loading: true,
    ready: false,
    refresh() {
      const refresh_context = get_refresh_context(__, "refresh", arg);
      const is_immediate_refresh = !refresh_context.cache[refresh_context.cache_key];
      const value = is_immediate_refresh ? get_promise() : fn();
      return update_refresh_value(refresh_context, value, is_immediate_refresh);
    },
    run() {
      if (!state.is_in_universal_load) {
        throw new Error(
          "On the server, .run() can only be called in universal `load` functions. Anywhere else, just await the query directly"
        );
      }
      return get_response(__, arg, state, fn);
    },
    /** @param {any} value */
    set(value) {
      return update_refresh_value(get_refresh_context(__, "set", arg), value);
    },
    /** @type {Promise<any>['then']} */
    then(onfulfilled, onrejected) {
      return get_promise().then(onfulfilled, onrejected);
    },
    withOverride() {
      throw new Error(`Cannot call '${__.name}.withOverride()' on the server`);
    },
    get [Symbol.toStringTag]() {
      return "QueryResource";
    }
  };
}
Object.defineProperty(query, "batch", { value: batch, enumerable: true });
function get_refresh_context(__, action, arg) {
  const { state } = get_request_store();
  const { refreshes } = state.remote;
  if (!refreshes) {
    const name = __.type === "query_batch" ? `query.batch '${__.name}'` : `query '${__.name}'`;
    throw new Error(
      `Cannot call ${action} on ${name} because it is not executed in the context of a command/form remote function`
    );
  }
  const cache = get_cache(__, state);
  const cache_key = stringify_remote_arg(arg, state.transport);
  const refreshes_key = create_remote_key(__.id, cache_key);
  return { __, state, refreshes, refreshes_key, cache, cache_key };
}
function update_refresh_value({ __, refreshes, refreshes_key, cache, cache_key }, value, is_immediate_refresh = false) {
  const promise = Promise.resolve(value);
  if (!is_immediate_refresh) {
    cache[cache_key] = { serialize: true, data: promise };
  }
  if (__.id) {
    refreshes[refreshes_key] = promise;
  }
  return promise.then(
    () => {
    },
    () => {
    }
  );
}
export {
  get_response as a,
  create_validator as c,
  get_cache as g,
  mark_argument_validated as m,
  parse_remote_response as p,
  query as q,
  run_remote_function as r
};
