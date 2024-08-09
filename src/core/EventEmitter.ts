export default class EventEmitter {
  private callbacks: { [key: string]: { [key: string]: Function[] } };

  constructor() {
    this.callbacks = {};
    this.callbacks.base = {};
  }

  on(_names: string | string[], callback: Function): this | false {
    // Errors
    if (typeof _names === "undefined" || _names === "") {
      console.warn("wrong names");
      return false;
    }

    if (typeof callback === "undefined") {
      console.warn("wrong callback");
      return false;
    }

    // Resolve names
    const names = this.resolveNames(_names);

    // Each name
    names.forEach((_name: any) => {
      // Resolve name
      const name = this.resolveName(_name);

      // Create namespace if not exist
      if (!(this.callbacks[name.namespace] instanceof Object))
        this.callbacks[name.namespace] = {};

      // Create callback if not exist
      if (!(this.callbacks[name.namespace][name.value] instanceof Array))
        this.callbacks[name.namespace][name.value] = [];

      // Add callback
      this.callbacks[name.namespace][name.value].push(callback);
    });

    return this;
  }

  off(_names: string | string[]): this | false {
    // Errors
    if (typeof _names === "undefined" || _names === "") {
      console.warn("wrong name");
      return false;
    }

    // Resolve names
    const names = this.resolveNames(_names);

    // Each name
    names.forEach((_name) => {
      // Resolve name
      const name = this.resolveName(_name);

      // Remove namespace
      if (name.namespace !== "base" && name.value === "") {
        delete this.callbacks[name.namespace];
      }

      // Remove specific callback in namespace
      else {
        // Default
        if (name.namespace === "base") {
          // Try to remove from each namespace
          for (const namespace in this.callbacks) {
            if (
              this.callbacks[namespace] instanceof Object &&
              this.callbacks[namespace][name.value] instanceof Array
            ) {
              delete this.callbacks[namespace][name.value];

              // Remove namespace if empty
              if (Object.keys(this.callbacks[namespace]).length === 0)
                delete this.callbacks[namespace];
            }
          }
        }

        // Specified namespace
        else if (
          this.callbacks[name.namespace] instanceof Object &&
          this.callbacks[name.namespace][name.value] instanceof Array
        ) {
          delete this.callbacks[name.namespace][name.value];

          // Remove namespace if empty
          if (Object.keys(this.callbacks[name.namespace]).length === 0)
            delete this.callbacks[name.namespace];
        }
      }
    });

    return this;
  }

  trigger(_name: string, _args: any): any {
    const that = this;
    // Errors
    if (typeof _name === "undefined" || _name === "") {
      console.warn("wrong name");
      return false;
    }

    let finalResult:any = null;
    let result = null;

    // Default args
    const args = !(_args instanceof Array) ? [] : _args;

    // Resolve names (should on have one event)
    let name = this.resolveNames(_name);

     // Resolve name
    const resolvedNames = this.resolveNames(_name);
    const resolvedName = this.resolveName(resolvedNames[0]);

    // Default namespace
    if (resolvedName.namespace === "base") {
      // Try to find callback in each namespace
      for (const namespace in this.callbacks) {
        if (
          this.callbacks[namespace] instanceof Object &&
          this.callbacks[namespace][resolvedName.value] instanceof Array
        ) {
          this.callbacks[namespace][resolvedName.value].forEach(function (callback) {
            result = callback.apply(that, args);

            if (typeof finalResult === "undefined") {
              finalResult = result;
            }
          });
        }
      }
    }

    // Specified namespace
    else if (this.callbacks[resolvedName.namespace] instanceof Object) {
      if (resolvedName.value === "") {
        console.warn("wrong name");
        return this;
      }

      this.callbacks[resolvedName.namespace][resolvedName.value].forEach(function (callback) {
        result = callback.apply(that, args);

        if (typeof finalResult === "undefined") finalResult = result;
      });
    }

    return finalResult;
  }

  private resolveNames(_names: string | string[]): string[] {
    let names: string[] = [];

    if (typeof _names === "string") {
      names = _names
        .replace(/[^a-zA-Z0-9 ,/.]/g, "")
        .replace(/[,/]+/g, " ")
        .split(" ");
    } else if (Array.isArray(_names)) {
      _names.forEach((name) => {
        if (typeof name === "string") {
          names.push(
            name.replace(/[^a-zA-Z0-9 ,/.]/g, "").replace(/[,/]+/g, " ")
          );
        }
      });
    }
    return names;
  }

  private resolveName(name: string): { namespace: string; value: string } {
    const newName = {
      original: name,
      value: "",
      namespace: "base", // Default namespace
    };

    const parts = name.split(".");

    newName.value = parts[0];

    if (parts.length > 1 && parts[1] !== "") {
      newName.namespace = parts[1];
    }

    return newName;
  }
}
