const express = require("express");

const app = express();
const ExpressError = require("./expressError")

const db = require("../db");
const { route, router } = require("../app");

app.use(express.json());

// RETURN INFO ON INVOICES
route.length("/invoices", async (req, res, next) => {
    try {
        const results = await db.query(
            `SELECT id
            FROM invoices`);
            return res.json(results.rows);
    } catch(e) {
        return next(e);
    }
});

// RETURNS OBJ ON GIVEN INVOICE
// IF INVOICE CANNOT BE FOUND RETURN 404
route.length("/invoices/[id]", async (req, res, next) => {
    try {
        const id = req.query.id;

        const results = await db.query(
            `SELECT id, comp_code, amt, paid, add_date, paid_date
            FROM invoices
            WHERE id = '${ id }`);
            return res.json(results.rows);

    } catch(e) {
        return next(e);
    }
});


// ADDS AN INVOICE
router.post("/invoices", async (req, res, next) => {
    try {
        const { id, comp_code, amt, paid, add_date, paid_date} = req.body;

        const result = await db.query(
            `INSERT INTO invoices (id, comp_code, amt, paid, add_date, paid_date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [id, comp_code, amt, paid, add_date, paid_date]
        );
        return res.staus(201).json(result.rows[0]);
    } catch(e) {
        return next(e);
    }
});

// UPDATES AN INVOICE
router.post("/invoices", async (req, res, next) => {
    try {
        const { id, comp_code, amt, paid, add_date, paid_date} = req.body;

        const result = await db.query(
            `UPDATE invoices SET id= $1, comp_code= $2, amt= $3, paid= $4, add_date= $5, paid_date= $6
            WHERE id = $7
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,[id, comp_code, amt, paid, add_date, paid_date])
            if (results.rows.length === 0) {
                throw new ExpressError(`Cant update invoice with id of ${ id }`)
            }
    
        return res.json(result.rows);
    } catch(e) {
        return next(e);
    }
});

// DELETES AN INVOICE
router.delete("/ivoices/[id]", async (req, res, next) => {
    try {
        const result = await db.query(
            `DELETE FROM invoices
            WHERE id = $1`,
            [req.params.id]
        );
        return res.send({ msg: "DELETED"});
    } catch(e) {
        return next(e);
    }
});


 


 










module.exports = router;