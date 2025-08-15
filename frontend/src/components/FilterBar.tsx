interface FilterBarProps {
    subjectFilter: string;
    setSubjectFilter: (value: string) => void;
    levelFilter: string;
    setLevelFilter: (value: string) => void;
    professorNameFilter: string;
    setProfessorNameFilter: (value: string) => void;
    handleClearFilters: () => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    showOnlyNonConflicting: boolean;
    setShowOnlyNonConflicting: (value: boolean) => void;
  }

export default function FilterBar({ subjectFilter, setSubjectFilter, levelFilter, setLevelFilter, professorNameFilter, setProfessorNameFilter, handleClearFilters, statusFilter, setStatusFilter, showOnlyNonConflicting, setShowOnlyNonConflicting }: FilterBarProps) {
    return (
        <div>
        <input
          type="text"
          className="subjectSearch"
          placeholder="Search by subject"
          value={subjectFilter}
          onChange = {
          (e) => {
            setSubjectFilter(e.target.value)
          } }></input>

          <select
          className="classLevel"
          value={levelFilter}
          onChange={(e) => {
            setLevelFilter(e.target.value)
          }}>
            <option value="">All Levels</option>
            <option value="1">1000 Levels</option>
            <option value="2">2000 Levels</option>
            <option value="3">3000 Levels</option>
            <option value="4">4000 Levels</option>
          </select>

          <label>
            <input
            type = "checkbox"
            checked = {statusFilter === 'O'}
            onChange = {(e) => {
              setStatusFilter(e.target.checked ? 'O' : '')
            }}
            /> 
            Show Open Courses
          </label>
          <input type="text"
          className="professorName" value={professorNameFilter}
          placeholder="Search by professor name"
          onChange ={(e) => {
            setProfessorNameFilter(e.target.value)
          } }
          ></input>
          <label>
            <input
            type="checkbox"
            checked={showOnlyNonConflicting}
            onChange={(e) => {
              setShowOnlyNonConflicting(e.target.checked)
            }}
            />
            Show Only Non-Conflicting Courses
          </label>
          <button className="clearFilters" onClick={handleClearFilters}>Clear Filters</button>
      </div>

    )
}
