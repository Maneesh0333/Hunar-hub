import Counter from "../models/Counter.model.js";

const autoIncrement = (schema, options) => {
  schema.pre("save", async function () {

    if (!this.isNew) return;

    const counter = await Counter.findByIdAndUpdate(
      options.prefix,
      { $inc: { seq: 1 } },
      { returnDocument: "after", upsert: true }
    );

    const number = String(counter.seq).padStart(3, "0");

    this[options.field] = `${options.prefix}-${number}`;
  });
};

export default autoIncrement;