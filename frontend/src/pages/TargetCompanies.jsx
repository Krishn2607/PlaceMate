import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    addTargetCompany,
    deleteTargetCompany,
    getTargetCompanies,
    updateTargetCompany,
} from "../services/targetCompanyService";

import "./TargetCompanies.css";


function TargetCompanies() {

    const [
        companies,
        setCompanies
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    const [
        success,
        setSuccess
    ] = useState("");

    const [
        companyName,
        setCompanyName
    ] = useState("");

    const [
        priority,
        setPriority
    ] = useState("1");

    const [
        editingId,
        setEditingId
    ] = useState(null);

    const [
        editName,
        setEditName
    ] = useState("");

    const [
        editPriority,
        setEditPriority
    ] = useState("1");

    const [
        submitting,
        setSubmitting
    ] = useState(false);


    // ==========================================
    // LOAD COMPANIES
    // ==========================================

    useEffect(() => {

        loadCompanies();

    }, []);


    const loadCompanies = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getTargetCompanies();

            setCompanies(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Load target companies error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load target companies"
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // SORT COMPANIES
    // ==========================================

    const sortedCompanies = useMemo(() => {

        return [...companies].sort(
            (a, b) => {

                const priorityDifference =
                    Number(a.priority || 0) -
                    Number(b.priority || 0);

                if (
                    priorityDifference !== 0
                ) {

                    return priorityDifference;

                }

                return (
                    a.companyName || ""
                ).localeCompare(
                    b.companyName || ""
                );

            }
        );

    }, [companies]);


    // ==========================================
    // ADD COMPANY
    // ==========================================

    const handleAddCompany = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        const trimmedName =
            companyName.trim();


        if (!trimmedName) {

            setError(
                "Company name is required."
            );

            return;

        }


        try {

            setSubmitting(true);

            const response =
                await addTargetCompany({

                    companyName:
                        trimmedName,

                    priority:
                        Number(priority),

                });


            setCompanies(
                response.targetCompanies || []
            );

            setCompanyName("");
            setPriority("1");

            setSuccess(
                "Target company added successfully."
            );

        } catch (error) {

            console.error(
                "Add target company error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to add target company"
            );

        } finally {

            setSubmitting(false);

        }

    };


    // ==========================================
    // START EDITING
    // ==========================================

    const handleStartEdit = (
        company
    ) => {

        setEditingId(
            company._id
        );

        setEditName(
            company.companyName || ""
        );

        setEditPriority(
            String(
                company.priority || 1
            )
        );

        setError("");
        setSuccess("");

    };


    // ==========================================
    // CANCEL EDIT
    // ==========================================

    const handleCancelEdit = () => {

        setEditingId(null);
        setEditName("");
        setEditPriority("1");

    };


    // ==========================================
    // SAVE EDIT
    // ==========================================

    const handleSaveEdit = async (
        companyId
    ) => {

        setError("");
        setSuccess("");


        const trimmedName =
            editName.trim();


        if (!trimmedName) {

            setError(
                "Company name is required."
            );

            return;

        }


        try {

            setSubmitting(true);

            const response =
                await updateTargetCompany(
                    companyId,
                    {
                        companyName:
                            trimmedName,

                        priority:
                            Number(
                                editPriority
                            ),
                    }
                );


            setCompanies(
                response.targetCompanies || []
            );

            handleCancelEdit();

            setSuccess(
                "Target company updated successfully."
            );

        } catch (error) {

            console.error(
                "Update target company error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update target company"
            );

        } finally {

            setSubmitting(false);

        }

    };


    // ==========================================
    // DELETE COMPANY
    // ==========================================

    const handleDelete = async (
        company
    ) => {

        const confirmed =
            window.confirm(
                `Delete ${company.companyName}?`
            );


        if (!confirmed) {
            return;
        }


        setError("");
        setSuccess("");


        try {

            setSubmitting(true);

            const response =
                await deleteTargetCompany(
                    company._id
                );


            setCompanies(
                response.targetCompanies || []
            );

            setSuccess(
                "Target company deleted successfully."
            );

        } catch (error) {

            console.error(
                "Delete target company error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete target company"
            );

        } finally {

            setSubmitting(false);

        }

    };


    // ==========================================
    // PRIORITY LABEL
    // ==========================================

    const getPriorityLabel = (
        companyPriority
    ) => {

        if (
            Number(companyPriority) === 1
        ) {

            return "Priority 1";

        }

        if (
            Number(companyPriority) === 2
        ) {

            return "Priority 2";

        }

        if (
            Number(companyPriority) === 3
        ) {

            return "Priority 3";

        }

        return `Priority ${companyPriority}`;

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="target-companies-page">

                <div className="target-loading">

                    <div className="target-loading-spinner" />

                    <p>
                        Loading target companies...
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="target-companies-page">


            {/* ======================================
                HEADER
            ======================================= */}

            <section className="target-header">

                <div>

                    <div className="target-eyebrow">
                        PLACEMENT TARGETS
                    </div>

                    <h1>
                        Target Companies
                    </h1>

                    <p>
                        Keep track of the companies
                        you want to prepare for.
                    </p>

                </div>


                <div className="company-count">

                    <strong>
                        {companies.length}
                    </strong>

                    <span>
                        companies
                    </span>

                </div>

            </section>


            {/* ======================================
                MESSAGES
            ======================================= */}

            {error && (

                <div className="target-message error">
                    {error}
                </div>

            )}


            {success && (

                <div className="target-message success">
                    {success}
                </div>

            )}


            {/* ======================================
                ADD COMPANY
            ======================================= */}

            <section className="target-add-card">

                <div className="target-card-heading">

                    <div>

                        <div className="target-section-label">
                            ADD COMPANY
                        </div>

                        <h2>
                            Add a target company
                        </h2>

                        <p>
                            Add as many companies as
                            you want to your placement list.
                        </p>

                    </div>

                </div>


                <form
                    className="target-add-form"
                    onSubmit={
                        handleAddCompany
                    }
                >

                    <div className="target-form-field company-name-field">

                        <label htmlFor="companyName">
                            Company name
                        </label>

                        <input
                            id="companyName"
                            type="text"
                            value={companyName}
                            onChange={(event) =>
                                setCompanyName(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. Google"
                            disabled={submitting}
                        />

                    </div>


                    <div className="target-form-field priority-field">

                        <label htmlFor="priority">
                            Priority
                        </label>

                        <select
                            id="priority"
                            value={priority}
                            onChange={(event) =>
                                setPriority(
                                    event.target.value
                                )
                            }
                            disabled={submitting}
                        >

                            <option value="1">
                                1
                            </option>

                            <option value="2">
                                2
                            </option>

                            <option value="3">
                                3
                            </option>

                        </select>

                    </div>


                    <button
                        type="submit"
                        className="target-primary-button"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Adding..."
                            : "Add company"}
                    </button>

                </form>

            </section>


            {/* ======================================
                COMPANY LIST
            ======================================= */}

            <section className="target-list-section">

                <div className="target-list-header">

                    <div>

                        <div className="target-section-label">
                            YOUR TARGETS
                        </div>

                        <h2>
                            Companies you're preparing for
                        </h2>

                    </div>

                    <span className="target-total">
                        {companies.length}
                    </span>

                </div>


                {companies.length === 0 ? (

                    <div className="target-empty">

                        <div className="target-empty-icon">
                            ◎
                        </div>

                        <h3>
                            No target companies yet
                        </h3>

                        <p>
                            Add your first company above
                            to start building your target list.
                        </p>

                    </div>

                ) : (

                    <div className="target-company-list">

                        {sortedCompanies.map(
                            (company) => (

                                <div
                                    className="target-company-row"
                                    key={company._id}
                                >

                                    {editingId ===
                                    company._id ? (

                                        <div className="target-edit-form">

                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(event) =>
                                                    setEditName(
                                                        event.target.value
                                                    )
                                                }
                                                disabled={submitting}
                                            />

                                            <select
                                                value={editPriority}
                                                onChange={(event) =>
                                                    setEditPriority(
                                                        event.target.value
                                                    )
                                                }
                                                disabled={submitting}
                                            >

                                                <option value="1">
                                                    1
                                                </option>

                                                <option value="2">
                                                    2
                                                </option>

                                                <option value="3">
                                                    3
                                                </option>

                                            </select>


                                            <button
                                                type="button"
                                                className="target-save-button"
                                                onClick={() =>
                                                    handleSaveEdit(
                                                        company._id
                                                    )
                                                }
                                                disabled={
                                                    submitting
                                                }
                                            >
                                                Save
                                            </button>


                                            <button
                                                type="button"
                                                className="target-cancel-button"
                                                onClick={
                                                    handleCancelEdit
                                                }
                                                disabled={
                                                    submitting
                                                }
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    ) : (

                                        <>

                                            <div className="target-company-main">

                                                <div className="company-avatar">
                                                    {company.companyName
                                                        ?.charAt(0)
                                                        .toUpperCase() ||
                                                        "C"}
                                                </div>

                                                <div>

                                                    <strong>
                                                        {
                                                            company.companyName
                                                        }
                                                    </strong>

                                                    <span>
                                                        Target company
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="target-company-right">

                                                <span
                                                    className={
                                                        `priority-badge priority-${company.priority}`
                                                    }
                                                >
                                                    {getPriorityLabel(
                                                        company.priority
                                                    )}
                                                </span>


                                                <button
                                                    type="button"
                                                    className="target-action-button"
                                                    onClick={() =>
                                                        handleStartEdit(
                                                            company
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    type="button"
                                                    className="target-action-button delete"
                                                    onClick={() =>
                                                        handleDelete(
                                                            company
                                                        )
                                                    }
                                                    disabled={
                                                        submitting
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

        </div>

    );

}


export default TargetCompanies;