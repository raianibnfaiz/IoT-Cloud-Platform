import React from 'react';

const TemplatesList = ({ templates }) => {
    return (
        <div className="overflow-x-auto mt-4">
            <table className="table w-full">
                {/* head */}
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Widgets</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {templates.length > 0 ? (
                        templates.map((template, index) => (
                            <tr key={index}>
                                <th>
                                    <label>
                                        <input type="checkbox" className="checkbox" />
                                    </label>
                                </th>
                                <td className="font-bold">{template.name}</td>
                                <td>{template.widgets}</td>
                                <th>
                                    <button className="btn btn-ghost btn-xs">details</button>
                                </th>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center text-gray-500">No templates created yet.</td>
                        </tr>
                    )}
                </tbody>
                {/* foot */}
                
            </table>
        </div>
    );
};

export default TemplatesList;