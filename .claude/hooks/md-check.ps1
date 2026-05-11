$d = [Console]::In.ReadToEnd() | ConvertFrom-Json
if ($d.tool_input.file_path -like '*.md') {
    @{
        hookSpecificOutput = @{
            hookEventName     = 'PostToolUse'
            additionalContext = '[DOC CONSISTENCY CHECK REQUIRED] You just edited a .md file. Review the ENTIRE existing document for content that conflicts with or is superseded by your additions/changes. Propose specific deletions or modifications to the user for any outdated content found.'
        }
    } | ConvertTo-Json -Compress
}
