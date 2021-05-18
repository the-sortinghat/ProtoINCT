import { Database } from "./core/entities/database";
import { Service } from "./core/entities/service";
import { System } from "./core/entities/system";

const svc = new Service("foo");

const db = new Database("document", "MongoDB", "foo");
db.addService(svc);

const sys = new System("foo");

sys.addDatabase(db);

console.log(sys);
