const fs = require('fs').promises;
const path = require('path');

// Whitelist of folders to include
const INCLUDED_FOLDERS = new Set([
    'app',
    'components',
    'features',
    'hooks',
    'lib',
    'models',
    'prisma',
    'scripts',
    'services',
    'styles',
    'utils'
]);

// Whitelist of root-level files to include
const INCLUDED_ROOT_FILES = new Set([
    '.dockerignore',
    '.editorconfig',
    '.eslintrc.json',
    '.gitattributes',
    '.gitignore',
    'Dockerfile',
    'README.md',
    'components.json',
    'contentlayer.config.js',
    'instrumentation-client.js',
    'middleware.js',
    'next-sitemap.config.js',
    'next.config.mjs',
    'nixpacks.toml',
    'package.json',
    'postcss.config.js',
    'tailwind.config.js',
    'tsconfig.json',
    'vercel.json'
]);

// Function to check if a file is a media or binary file
function isMediaOrBinaryFile(filename) {
    const mediaExtensions = [
        // Images
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'ico', 'svg',
        // Videos
        'mp4', 'webm', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'm4v',
        // Audio
        'mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac',
        // Other media/binary
        'pdf', 'psd', 'ai', 'eps',
        // Binary files
        'zip', 'tar', 'gz', 'rar', '7z',
        'exe', 'dll', 'so', 'dylib',
        'woff', 'woff2', 'ttf', 'otf', 'eot',
        // Lock files
        'lock'
    ];
    const ext = path.extname(filename).toLowerCase().slice(1);
    
    // Also check for lock files by name
    if (filename === 'yarn.lock' || 
        filename === 'package-lock.json' || 
        filename === 'pnpm-lock.yaml' ||
        filename === 'bun.lockb') {
        return true;
    }
    
    return mediaExtensions.includes(ext);
}

// Function to check if path should be ignored based on custom patterns
function shouldIgnoreCustomPath(relativePath, filename = '') {
    const customIgnorePatterns = [
        // Ignore page_components/Cards/Tutorial/ directory
        'page_components/Cards/Tutorial',
        'page_components\\Cards\\Tutorial', // Windows path separator
        
        // Ignore files ending with _old
        '.*_old\\.',
        '.*_old$'
    ];
    
    for (const pattern of customIgnorePatterns) {
        const regex = new RegExp(pattern);
        if (regex.test(relativePath) || regex.test(filename)) {
            return true;
        }
    }
    
    // Additional check for _old files by filename
    if (filename && (filename.includes('_old.') || filename.endsWith('_old'))) {
        return true;
    }
    
    return false;
}

// Check if a file should be included
function shouldIncludeFile(filename, relativePath, isRootLevel = false) {
    // Always ignore the output file
    if (filename === 'CLAUDE_CONTEXT.md') {
        return false;
    }
    
    // Ignore media and binary files
    if (isMediaOrBinaryFile(filename)) {
        return false;
    }
    
    // Ignore custom patterns
    if (shouldIgnoreCustomPath(relativePath, filename)) {
        return false;
    }
    
    // If it's a root level file, check the whitelist
    if (isRootLevel) {
        return INCLUDED_ROOT_FILES.has(filename);
    }
    
    // For non-root files, include if parent folder is whitelisted
    return true;
}

// Check if a folder should be included
function shouldIncludeFolder(folderName, relativePath, isRootLevel = false) {
    // Ignore custom patterns
    if (shouldIgnoreCustomPath(relativePath, folderName)) {
        return false;
    }
    
    // If it's a root level folder, check the whitelist
    if (isRootLevel) {
        return INCLUDED_FOLDERS.has(folderName);
    }
    
    // For non-root folders (subfolders), include them if we're already in a whitelisted folder
    return true;
}

// Function to create file structure tree
async function getFileStructure(dirPath, prefix = '', basePath = '', isRootLevel = false) {
    let output = '';
    
    try {
        const items = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const item of items) {
            const relativePath = path.join(basePath, item.name);
            
            if (item.isDirectory() && !shouldIncludeFolder(item.name, relativePath, isRootLevel)) {
                continue;
            }
            if (!item.isDirectory() && !shouldIncludeFile(item.name, relativePath, isRootLevel)) {
                continue;
            }
            
            output += `${prefix}${item.isDirectory() ? '├── ' : '└── '}${item.name}\n`;
            if (item.isDirectory()) {
                output += await getFileStructure(
                    path.join(dirPath, item.name),
                    prefix + '│   ',
                    relativePath,
                    false
                );
            }
        }
    } catch (error) {
        console.warn(`Warning: Could not read directory structure for ${dirPath}:`, error.message);
    }
    
    return output;
}

// Main function
async function main() {
    try {
        console.log('Generating file structure for Claude...');
        
        const dirPath = '.';
        let output = 'File Structure:\n\n';
        output += `${dirPath}/\n\`\`\`\n`;
        
        const structure = await getFileStructure(dirPath, '', '', true);
        output += structure + '\n\`\`\`\n';
        
        const outputFile = 'CLAUDE_CONTEXT.md';
        await fs.writeFile(outputFile, output);
        
        console.log(`✅ Successfully created ${outputFile}`);
        console.log(`📊 Output file size: ${(output.length / 1024).toFixed(2)} KB`);
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

main();